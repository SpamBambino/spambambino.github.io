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

  Why we are doing it this way:
  - It is easier to maintain than hand-writing every tile in HTML
  - You can change project data in one place later
  - It is a clean bridge toward future repo-driven content
*/

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-button");
  const siteMenu = document.getElementById("site-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const projectGrid = document.getElementById("project-grid");

  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  document.documentElement.setAttribute("data-theme", currentTheme);

  /*
    Tile data source.

    How this works:
    - If repo is provided, the tile title comes from repo.title
    - If repo is missing or null, the tile falls back to "Placeholder Tile"
    - href is optional; if present, the tile becomes a clickable link
    - description and icon can also fall back to simple defaults

    For now, this is manual data.
    Later, we can upgrade this so the data comes from a JSON file or GitHub API.
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
    Helper function to build one tile element.
    It decides:
    - what HTML element to use (<a> for links, <article> for placeholders)
    - what title to display
    - what description to display
  */
  function createProjectTile(tile) {
    const hasLink = typeof tile.href === "string" && tile.href.trim() !== "";
    const element = document.createElement(hasLink ? "a" : "article");

    const title = tile.repo?.title?.trim() || "Placeholder Tile";
    const description =
      tile.repo?.description?.trim() || "No project is attached to this tile yet.";
    const icon = tile.icon?.trim() || "📁";

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
    Render all tiles into the grid.
    This clears the grid first, then rebuilds it from the projectTiles array.
  */
  function renderProjectTiles() {
    projectGrid.innerHTML = "";

    projectTiles.forEach((tile) => {
      const tileElement = createProjectTile(tile);
      projectGrid.appendChild(tileElement);
    });
  }

  function openMenu() {
    siteMenu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");

    const firstLink = siteMenu.querySelector("a");
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeMenu() {
    siteMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

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

  siteMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu =
      siteMenu.contains(event.target) || menuButton.contains(event.target);

    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
  });

  /*
    Initial page setup.
    Render the tile grid after the page loads.
  */
  renderProjectTiles();
});