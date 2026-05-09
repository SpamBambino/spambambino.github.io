/*
  SpamBambino Playground - Version 1 homepage behavior

  What this file does:
  - Opens and closes the dropdown menu
  - Makes the dropdown keyboard-friendly
  - Closes the menu when clicking outside it
  - Supports a manual light/dark mode toggle
  - Builds the project tile grid from a data array
  - Uses repo titles when a tile has a repo attached
  - Falls back to "Placeholder Tile" when no repo is attached

  Why this version is safer:
  - It checks that important page elements exist before using them
  - It avoids crashing if optional tile data is missing
  - It gives us a cleaner foundation for later improvements
*/

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-button");
  const siteMenu = document.getElementById("site-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const projectGrid = document.getElementById("project-grid");

  /*
    Theme setup:
    - Default to the user's system preference
    - Allow the button to manually switch during the current page session
  */
  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  document.documentElement.setAttribute("data-theme", currentTheme);

  /*
    Tile data:
    - If repo exists, use repo.title and repo.description
    - If repo is null, use fallback placeholder values
    - href decides whether the tile is clickable
  */
  const projectTiles = [
    {
      repo: {
        title: "test-project",
        description: "Live demo project in a separate repository."
      },
      href: "https://spambambino.github.io/test-project/",
      icon: "🔢"
    },
    {
      repo: null,
      href: null,
      icon: "📁"
    },
    {
      repo: null,
      href: null,
      icon: "📁"
    },
    {
      repo: null,
      href: null,
      icon: "📁"
    },
    {
      repo: null,
      href: null,
      icon: "📁"
    },
    {
      repo: null,
      href: null,
      icon: "📁"
    }
  ];

  /*
    Build one tile element at a time.
    - Linked projects use <a>
    - Placeholders use <article>
  */
  function createProjectTile(tile) {
    const hasLink = typeof tile.href === "string" && tile.href.trim() !== "";
    const element = document.createElement(hasLink ? "a" : "article");

    const title =
      tile &&
      tile.repo &&
      typeof tile.repo.title === "string" &&
      tile.repo.title.trim() !== ""
        ? tile.repo.title.trim()
        : "Placeholder Tile";

    const description =
      tile &&
      tile.repo &&
      typeof tile.repo.description === "string" &&
      tile.repo.description.trim() !== ""
        ? tile.repo.description.trim()
        : "No project is attached to this tile yet.";

    const icon =
      tile &&
      typeof tile.icon === "string" &&
      tile.icon.trim() !== ""
        ? tile.icon.trim()
        : "📁";

    element.className = "project-tile";

    if (!hasLink) {
      element.classList.add("placeholder-tile");
    } else {
      element.href = tile.href;
    }

    element.innerHTML = `
      <span class="tile-icon" aria-hidden="true">${icon}</span>
      <span class="tile-title">${title}</span>
      <span class="tile-description">${description}</span>
    `;

    return element;
  }

  /*
    Render the full tile grid.
    This function safely exits if the grid container is missing.
  */
  function renderProjectTiles() {
    if (!projectGrid) {
      return;
    }

    projectGrid.innerHTML = "";

    projectTiles.forEach((tile) => {
      const tileElement = createProjectTile(tile);
      projectGrid.appendChild(tileElement);
    });
  }

  /*
    Menu helpers:
    These only run if the menu elements actually exist.
  */
  function openMenu() {
    if (!siteMenu || !menuButton) {
      return;
    }

    siteMenu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");

    const firstLink = siteMenu.querySelector("a");
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeMenu() {
    if (!siteMenu || !menuButton) {
      return;
    }

    siteMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!menuButton) {
      return;
    }

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      toggleMenu();
    });

    menuButton.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openMenu();
      }

      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  if (siteMenu) {
    siteMenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();

        if (menuButton) {
          menuButton.focus();
        }
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!siteMenu || !menuButton) {
      return;
    }

    const clickedInsideMenu =
      siteMenu.contains(event.target) || menuButton.contains(event.target);

    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", currentTheme);
    });
  }

  /*
    Initial page setup:
    Render the tiles as soon as the DOM is ready.
  */
  renderProjectTiles();
});