/*
  SpamBambino Playground - Version 1 homepage behavior

  What this file does:
  - Opens and closes the dropdown menu
  - Makes the dropdown keyboard-friendly
  - Closes the menu when clicking outside it
  - Supports a manual light/dark mode toggle
  - Respects the user's system color preference by default

  Why use JavaScript here:
  - HTML gives us structure
  - CSS gives us appearance
  - JavaScript gives us interactive behavior
*/

// Wait until the HTML has finished loading before we try to use page elements
document.addEventListener("DOMContentLoaded", () => {
  // Grab the elements we need from the page
  const menuButton = document.getElementById("menu-button");
  const siteMenu = document.getElementById("site-menu");
  const themeToggle = document.getElementById("theme-toggle");

  // Track the current theme in memory.
  // We are not using localStorage here to keep the setup simple and compatible
  // with environments where storage may be restricted.
  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  // Apply the initial theme to the <html> element
  document.documentElement.setAttribute("data-theme", currentTheme);

  /*
    Helper function to open the menu.
    It removes the "hidden" attribute so the menu appears,
    updates aria-expanded for accessibility,
    and moves keyboard focus to the first link.
  */
  function openMenu() {
    siteMenu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");

    const firstLink = siteMenu.querySelector("a");
    if (firstLink) {
      firstLink.focus();
    }
  }

  /*
    Helper function to close the menu.
    It hides the menu and updates aria-expanded so assistive technology
    knows the menu is no longer open.
  */
  function closeMenu() {
    siteMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  /*
    Helper function to toggle the menu.
    If it is hidden, open it.
    If it is visible, close it.
  */
  function toggleMenu() {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Clicking the menu button opens or closes the dropdown
  menuButton.addEventListener("click", () => {
    toggleMenu();
  });

  /*
    Keyboard support for the menu button:
    - ArrowDown opens the menu
    - Escape closes the menu
  */
  menuButton.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu();
    }

    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /*
    Keyboard support inside the dropdown menu:
    - Escape closes the menu and returns focus to the menu button
  */
  siteMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });

  /*
    If the user clicks anywhere outside the menu wrapper,
    close the dropdown so it behaves like a normal menu.
  */
  document.addEventListener("click", (event) => {
    const clickedInsideMenu =
      siteMenu.contains(event.target) || menuButton.contains(event.target);

    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  /*
    Theme toggle:
    Switch between light and dark mode manually.
    We store the current value in a variable and apply it to <html>.
  */
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
  });
});