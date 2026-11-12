"use strict";

/* ==========================================
   EXPLORESPACE SINGLE PAGE APPLICATION
========================================== */


/* ==========================================
   APPLICATION DATA
========================================== */

const ITEMS = [

    {
        id: "design",
        icon: "🎨",
        name: "Creative Design",
        category: "Creative",
        description:
            "Discover principles for attractive and accessible interface design."
    },

    {
        id: "code",
        icon: "💻",
        name: "Web Development",
        category: "Technology",
        description:
            "Build interactive websites with modern browser technologies."
    },

    {
        id: "space",
        icon: "🚀",
        name: "Space Exploration",
        category: "Science",
        description:
            "Learn about missions and discoveries beyond Earth."
    },

    {
        id: "photo",
        icon: "📷",
        name: "Photography",
        category: "Creative",
        description:
            "Explore composition, lighting and visual storytelling."
    },

    {
        id: "ai",
        icon: "🤖",
        name: "Artificial Intelligence",
        category: "Technology",
        description:
            "Understand intelligent computer systems."
    },

    {
        id: "nature",
        icon: "🌿",
        name: "Nature & Ecology",
        category: "Science",
        description:
            "Explore ecosystems and biodiversity."
    }

];


/* ==========================================
   APPLICATION STATE
========================================== */

const STORAGE_KEY = "explorespace-favorites";

const state = {

    search: "",

    category: "All",

    favorites: new Set()

};


/* ==========================================
   DOM ELEMENTS
========================================== */

const main = document.getElementById("main-content");

const toast = document.getElementById("toast");

const currentPage = document.getElementById("current-page");

const favoriteCount = document.getElementById("favorite-count");

let toastTimer;


/* ==========================================
   LOAD FAVORITES FROM LOCAL STORAGE
========================================== */

function loadFavorites() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (Array.isArray(saved)) {

            const validIds = saved.filter(id =>
                ITEMS.some(item => item.id === id)
            );

            state.favorites = new Set(validIds);

        }

    } catch (error) {

        console.error(
            "Error loading favorites:",
            error
        );

        state.favorites = new Set();

    }

}


/* ==========================================
   SAVE FAVORITES
========================================== */

function saveFavorites() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...state.favorites])
        );

    } catch (error) {

        console.error(
            "Unable to save favorites:",
            error
        );

        showToast(
            "Favorites saved for this session only."
        );

    }

}


/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================
   UPDATE FAVORITE COUNTER
========================================== */

function updateFavoriteCount() {

    favoriteCount.textContent = state.favorites.size;

    const homeCount = document.getElementById(
        "home-favorite-count"
    );

    if (homeCount) {

        homeCount.textContent = state.favorites.size;

    }

}


/* ==========================================
   CREATE DYNAMIC TOPIC CARD
========================================== */

function createCard(item) {

    const saved = state.favorites.has(item.id);

    return `

        <article class="card">

            <div class="card-icon">
                ${item.icon}
            </div>

            <h3>${item.name}</h3>

            <p class="muted">
                ${item.description}
            </p>

            <div class="card-bottom">

                <span class="tag">
                    ${item.category}
                </span>

                <button
                    class="icon-button"
                    type="button"
                    data-favorite="${item.id}"
                    aria-pressed="${saved}"
                    aria-label="${saved ? "Remove" : "Add"} ${item.name} ${saved ? "from" : "to"} favorites"
                >

                    ${saved ? "♥ Saved" : "♡ Save"}

                </button>

            </div>

        </article>

    `;

}


/* ==========================================
   HOME PAGE
========================================== */

function homePage() {

    return `

        <section class="page">

            <div class="hero">

                <span class="eyebrow">
                    WELCOME TO EXPLORESPACE
                </span>

                <h1 class="heading">
                    One app. Endless things to explore.
                </h1>

                <p class="muted">

                    Experience smooth navigation,
                    dynamic content and instant
                    interactions without refreshing
                    the entire webpage.

                </p>

                <div class="actions">

                    <a href="#/explore" class="button">
                        Start Exploring →
                    </a>

                    <a href="#/about"
                       class="button secondary">

                        How It Works

                    </a>

                </div>

            </div>


            <div class="stats">

                <div class="stat">

                    <strong>4</strong>

                    <span>Dynamic Routes</span>

                </div>

                <div class="stat">

                    <strong>6</strong>

                    <span>Topics Available</span>

                </div>

                <div class="stat">

                    <strong id="home-favorite-count">
                        ${state.favorites.size}
                    </strong>

                    <span>Saved Favorites</span>

                </div>

            </div>


            <h2 class="section-title">
                Featured Topics
            </h2>


            <div class="grid">

                ${ITEMS.slice(0, 3)
                    .map(createCard)
                    .join("")}

            </div>

        </section>

    `;

}


/* ==========================================
   EXPLORE PAGE
========================================== */

function explorePage() {

    const categories = [
        "All",
        "Creative",
        "Technology",
        "Science"
    ];

    return `

        <section class="page">

            <span class="eyebrow">
                DISCOVER AND LEARN
            </span>

            <h1 class="heading">
                Explore Topics
            </h1>

            <p class="muted">

                Search, filter and save your favorite
                topics without reloading the page.

            </p>


            <div class="toolbar">

                <input
                    type="search"
                    id="search"
                    class="search"
                    placeholder="Search topics..."
                    aria-label="Search topics"
                    autocomplete="off"
                >


                <div class="filters">

                    ${categories.map(category => `

                        <button
                            class="filter ${
                                state.category === category
                                    ? "active"
                                    : ""
                            }"
                            data-category="${category}"
                            aria-pressed="${
                                state.category === category
                            }"
                        >

                            ${category}

                        </button>

                    `).join("")}

                </div>

            </div>


            <div
                id="results"
                class="grid"
                aria-live="polite"
            ></div>

        </section>

    `;

}


/* ==========================================
   FAVORITES PAGE
========================================== */

function favoritesPage() {

    const favorites = ITEMS.filter(item =>
        state.favorites.has(item.id)
    );

    if (favorites.length === 0) {

        return `

            <section class="page">

                <span class="eyebrow">
                    YOUR COLLECTION
                </span>

                <h1 class="heading">
                    Saved Favorites
                </h1>


                <div class="panel empty">

                    <div class="empty-icon">
                        ♡
                    </div>

                    <h2>
                        No Favorites Yet
                    </h2>

                    <p class="muted">

                        Explore topics and save
                        your favorite ones.

                    </p>

                    <a href="#/explore"
                       class="button">

                        Explore Topics →

                    </a>

                </div>

            </section>

        `;

    }

    return `

        <section class="page">

            <span class="eyebrow">
                YOUR COLLECTION
            </span>

            <h1 class="heading">
                Saved Favorites
            </h1>

            <p class="muted">

                Your saved topics are stored
                locally in your browser.

            </p>

            <div class="grid" style="margin-top:25px;">

                ${favorites.map(createCard).join("")}

            </div>

        </section>

    `;

}


/* ==========================================
   ABOUT PAGE
========================================== */

function aboutPage() {

    return `

        <section class="page">

            <span class="eyebrow">
                ABOUT THE APPLICATION
            </span>

            <h1 class="heading">
                How This SPA Works
            </h1>

            <p class="muted">

                ExploreSpace demonstrates the
                core concepts of a Single Page
                Application using HTML, CSS
                and JavaScript.

            </p>


            <h2 class="section-title">
                Application Architecture
            </h2>


            <div class="steps">

                <div class="panel step">

                    <span class="step-num">01</span>

                    <div>

                        <h3>Single HTML Container</h3>

                        <p class="muted">

                            The application uses one
                            HTML document while
                            JavaScript dynamically
                            updates the main content.

                        </p>

                    </div>

                </div>


                <div class="panel step">

                    <span class="step-num">02</span>

                    <div>

                        <h3>Client-Side Routing</h3>

                        <p class="muted">

                            URL hash changes determine
                            which content is displayed.

                            Browser Back and Forward
                            navigation is supported.

                        </p>

                    </div>

                </div>


                <div class="panel step">

                    <span class="step-num">03</span>

                    <div>

                        <h3>Dynamic DOM Manipulation</h3>

                        <p class="muted">

                            JavaScript creates and
                            updates page content
                            without full reloads.

                        </p>

                    </div>

                </div>


                <div class="panel step">

                    <span class="step-num">04</span>

                    <div>

                        <h3>State Management</h3>

                        <p class="muted">

                            Application state stores
                            search filters and favorites.

                            LocalStorage preserves
                            favorites after refreshing.

                        </p>

                    </div>

                </div>

            </div>


            <div class="actions">

                <a href="#/explore"
                   class="button">

                    Try the Application →

                </a>

            </div>

        </section>

    `;

}


/* ==========================================
   ROUTE CONFIGURATION
========================================== */

const routes = {

    "/home": {
        title: "Home",
        render: homePage
    },

    "/explore": {
        title: "Explore",
        render: explorePage
    },

    "/favorites": {
        title: "Favorites",
        render: favoritesPage
    },

    "/about": {
        title: "About",
        render: aboutPage
    }

};


/* ==========================================
   DYNAMIC SEARCH AND FILTERING
========================================== */

function renderResults() {

    const results = document.getElementById("results");

    if (!results) {
        return;
    }

    const searchText = state.search
        .trim()
        .toLowerCase();


    const filteredItems = ITEMS.filter(item => {

        const categoryMatch =
            state.category === "All" ||
            item.category === state.category;


        const searchMatch =
            item.name.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);


        return categoryMatch && searchMatch;

    });


    if (filteredItems.length === 0) {

        results.innerHTML = `

            <div class="panel empty"
                 style="grid-column:1/-1;">

                <h2>No Matching Topics</h2>

                <p class="muted">

                    Try another search term
                    or category.

                </p>

            </div>

        `;

        return;

    }


    results.innerHTML = filteredItems
        .map(createCard)
        .join("");

}


/* ==========================================
   CLIENT-SIDE ROUTER
========================================== */

function renderRoute() {

    let path;

    try {

        path = decodeURIComponent(
            window.location.hash
                .slice(1)
                .split("?")[0] || "/home"
        );

    } catch (error) {

        console.error("Invalid route:", error);

        path = "/invalid-route";

    }


    const route = routes[path];


    /* Handle invalid routes */

    if (!route) {

        main.innerHTML = `

            <section class="page panel empty">

                <div class="empty-icon">
                    404
                </div>

                <h1>Page Not Found</h1>

                <p class="muted">

                    The requested page does not exist.

                </p>

                <a href="#/home"
                   class="button">

                    Return Home

                </a>

            </section>

        `;

        currentPage.textContent = "Not Found";

        document.title = "404 | ExploreSpace";

    } else {

        /* Render selected page */

        main.innerHTML = route.render();

        currentPage.textContent = route.title;

        document.title =
            route.title + " | ExploreSpace";


        /* Restore Explore page state */

        if (path === "/explore") {

            const searchInput =
                document.getElementById("search");

            searchInput.value = state.search;

            renderResults();

        }

    }


    /* Update active navigation */

    document.querySelectorAll(".nav-link")
        .forEach(link => {

            const active =
                link.getAttribute("href") === "#" + path;

            link.classList.toggle("active", active);

            if (active) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute("aria-current");

            }

        });


    updateFavoriteCount();


    /* Scroll to top after navigation */

    window.scrollTo(0, 0);

}


/* ==========================================
   BROWSER HISTORY MANAGEMENT
========================================== */

/*
Hash-based routing automatically creates
browser history entries when navigation
links change the URL hash.

The hashchange event handles:
- Internal navigation
- Browser Back button
- Browser Forward button
- Direct hash URLs

No full page reload is required.
*/

window.addEventListener(
    "hashchange",
    renderRoute
);


/* ==========================================
   EVENT DELEGATION
========================================== */

document.addEventListener("click", function(event) {


    /* --------------------------------------
       FAVORITES BUTTON
    -------------------------------------- */

    const favoriteButton =
        event.target.closest("[data-favorite]");


    if (favoriteButton) {

        const id = favoriteButton.dataset.favorite;

        const itemExists = ITEMS.some(item =>
            item.id === id
        );

        if (!itemExists) {
            return;
        }


        if (state.favorites.has(id)) {

            state.favorites.delete(id);

            showToast("Removed from favorites");

        } else {

            state.favorites.add(id);

            showToast("Added to favorites");

        }


        saveFavorites();


        const currentRoute =
            window.location.hash
                .slice(1)
                .split("?")[0] || "/home";


        if (currentRoute === "/explore") {

            renderResults();

        } else if (currentRoute === "/favorites") {

            renderRoute();

        } else {

            // Update cards on the current page.
            document.querySelectorAll(
                `[data-favorite="${id}"]`
            ).forEach(button => {

                const saved = state.favorites.has(id);

                button.textContent =
                    saved ? "♥ Saved" : "♡ Save";

                button.setAttribute(
                    "aria-pressed",
                    String(saved)
                );

            });

        }


        updateFavoriteCount();

        return;

    }


    /* --------------------------------------
       CATEGORY FILTER
    -------------------------------------- */

    const filterButton =
        event.target.closest("[data-category]");


    if (filterButton) {

        state.category =
            filterButton.dataset.category;


        document.querySelectorAll("[data-category]")
            .forEach(button => {

                const active =
                    button.dataset.category ===
                    state.category;


                button.classList.toggle(
                    "active",
                    active
                );

                button.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });


        renderResults();

    }

});


/* ==========================================
   SEARCH INPUT EVENT
========================================== */

document.addEventListener("input", function(event) {

    if (event.target.id === "search") {

        state.search = event.target.value;

        renderResults();

    }

});


/* ==========================================
   INITIALIZE APPLICATION
========================================== */

function initializeApp() {

    loadFavorites();

    renderRoute();

    console.log(
        "ExploreSpace SPA initialized successfully."
    );

}


/* Start the application */

initializeApp();