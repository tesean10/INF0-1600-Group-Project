const API_KEY = 'cc6be9344c3535221497d244fe2f7ff2';
const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

let visibleMovies = 18;
let currentMovies = [];
const genreNames =
{
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    27: "Horror",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller"
};

let movieData = []; 

// Fetch Data from TMDB
async function getMovies() {
try {
    const res = await fetch(API_URL);
    const data = await res.json();
    movieData = data.results;
    currentMovies = [...movieData];

    displayMovies(currentMovies.slice(0, visibleMovies));
    if (typeof setupGenres === 'function') setupGenres(movieData);
    } catch (error) {
    console.error('Error fetching movies:', error);
    }
}

// Render Movies to the Container
function displayMovies(movies) {
    const container = document.getElementById('movie-container');
    if (!container) return;
    
    container.innerHTML = '';

    movies.forEach(movie => 
    {
        const { title, poster_path, vote_average, release_date } = movie;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card'); 

        movieElement.innerHTML = `
        <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/500x750'}" alt="${title}">
        <div class="movie-info">
        <h3>${title}</h3>
        <span class="rating">${vote_average.toFixed(1)}</span>
        <p>${release_date ? release_date.split('-')[0] : 'N/A'}</p>
        <button class="fav-btn ${isFavourite(movie.id) ? 'saved' : ''}" 
                onclick="event.stopPropagation(); addToFavourites('${movie.id}', this)">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1
            </svg>
        </button>
        </div>
        `;

         movieElement.onclick = (e) => 
            {
                // Prevents the click event from triggering when the button is clicked
                if(e.target.tagName.toLowerCase() !== 'button' && !e.target.closest('button'))
                {
                    showMovieDetails(movie);
                }
            };

         container.appendChild(movieElement);
    });
}

// Search Movies (Local Filter)
function searchMovies() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredMovies = movieData.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);
}
// API Search Logic Entire catalouge
async function searchMovies() {
    const query = document.getElementById('search-input').value;
    
    if (query.trim() === "") {
        getMovies(); // If empty, show top rated
        return;
    }

    try {
        const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        const res = await fetch(SEARCH_URL);
        const data = await res.json();
        
        displayMovies(data.results);
    } catch (error) {
        console.error("Search failed:", error);
    }
}
// Sort Movies
function sortMovies(type) {
    let sorted = [...movieData];
    if (type === 'date') { 
        sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (type === 'alpha') {
        sorted.sort((a, b) => a.title.localeCompare(b.title)); 
    }
    displayMovies(sorted);
}

// Toggle Menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
}

//getMovies();

//login
function login()
{
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (email === "bob@mail.com" && password === "bobpass")
    {
        sessionStorage.setItem("loggedIn", true);
        window.location.href = "index.html";
    }
    else
    {
        alert("Invalid login");
    }
}

function isFavourite(id)
{
    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    return favs.includes(String(id));
}

function addToFavourites(id, buttonElement)
{
    const loggedIn = sessionStorage.getItem("loggedIn");

    if (!loggedIn)
    {
        alert("Please log in first to save favourites.")
        window.location.href = "login.html";
        return;
    }

    let favs = JSON.parse(localStorage.getItem("favourites")) || [];

    if (favs.includes(id))
    {
        favs = favs.filter(movieId => movieId !== id);

        if(buttonElement)
        {
            buttonElement.classList.remove("saved");
        }

        alert("Removed from favourites");
    }
    else
    {
        favs.push(id);

        if(buttonElement)
        {
            buttonElement.classList.add("saved");
        }

        alert("Added to favourites");
    }

    localStorage.setItem("favourites", JSON.stringify(favs));

}

function displayFavouritesPage(movies)
{
    const container = document.getElementById("favourites-container");
    if (!container) return;
    movies.forEach(movie =>
        {
            const { title, poster_path, vote_average, release_date } = movie;   
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card');
            movieElement.innerHTML = `
            <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/500x750'}" alt="${title}">
            <div class="movie-info">
            <h3>${title}</h3>
            <span class="rating">${vote_average}</span>
            <p>${release_date ? release_date.split('-')[0] : 'N/A'}</p>

            <button class="fav-btn ${isFavourite(movie.id) ? 'saved' : ''}" 
                    onclick="event.stopPropagation(); addToFavourites('${movie.id}', this)"> 
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1
            </svg>
            </button>
            </div>
            `;
            movieElement.onclick = (e) => 
            {
                if(e.target.tagName !== 'BUTTON' && !e.target.closest('BUTTON'))
                {
                    showMovieDetails(movie);
                }
            };

                container.appendChild(movieElement);
            
        });
}
// Load Favourites
async function loadFavourites()
{
    console.log("1: Loading favourites...");
    const container = document.getElementById("favourites-container");
    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    container.innerHTML = '';

    console.log("2: Saved ids found:", favs);
    if (favs.length === 0)
    {
        container.innerHTML = '<p class="empty-msg">No favourites added yet.</p>';
        return;
    }   

    for (const id of favs)
    {
        console.log(`3: Fetching details for movie ID ${id}...`);
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const movie = await res.json();
        displayFavouritesPage([movie]);
    }

}

//movie modal
function showMovieDetails(movie) 
{
    const modal = document.getElementById("movie-modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <div class="modal-layout">
            <div class="modal-left">
                <h2>${movie.title}</h2>
                <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <p><strong>Year:</strong> ${
                    movie.release_date
                        ? movie.release_date.split('-')[0]
                        : 'N/A'
                }</p>
                <button class="fav-btn ${isFavourite(movie.id) ? 'saved' : ''}" 
                        onclick="event.stopPropagation(); addToFavourites('${movie.id}', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 16 16">
                         <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                         <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                    </svg>
                </button>
            </div>

            <div class="modal-right">
                <h3>Synopsis</h3>
                <p>${movie.overview}</p>
            </div>
        </div>

        <button class="close-btn" onclick="closeModal()">Close</button>
    `;

    modal.classList.add("show");
}

//clodse modal
function closeModal()
{
    document.getElementById("movie-modal").classList.remove("show");
}

//window onload
window.onload = () =>
{
    if(document.getElementById("movie-container"))
    {
        getMovies();
    }

    if(document.getElementById("favourites-container"))
    {
        loadFavourites();
    }

    if(document.getElementById("auth-link"))
    {
       updateAuthButton();
    }

    const searchInput = document.getElementById("search-input");

    if(searchInput)
    {
        searchInput.addEventListener("input", liveSearch);
    }
}

function setupGenres(movies)
{
    const menu = document.getElementById("genre-dropdown-menu");
    if (!menu) return;

    const uniqueGenres = new Set();

    movies.forEach(movie => {
        movie.genre_ids?.forEach(id => uniqueGenres.add(id));
    });

    menu.innerHTML =`<a onclick="displayMovies(movieData)">All</a>`;

    uniqueGenres.forEach(id => {
        if(genreNames[id])
        {
            const item = document.createElement("a");
            item.innerText = genreNames[id];

            item.onclick = () => 
            {
                const filtered = movieData.filter(movie =>
                    movie.genre_ids?.includes(id)
                );
                displayMovies(filtered);
            };

            menu.appendChild(item);
        }
    });
}

function updateAuthButton()
{
    const authLink = document.getElementById("auth-link");
    if (!authLink) return;

    if(sessionStorage.getItem("loggedIn"))
    {
        authLink.innerText = "Logout";
        authLink.href ="#";
        authLink.onclick = logout;
    }
    else
    {
        authLink.innerText ="Login";
        authLink.href = "login.html";
        authLink.onclick = null;
    }
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

//load movies by 18
function loadMoreMovies()
{
    visibleMovies +=18;
    // displayMovies(currentMovies.slice(0, visibleMovies));
    displayMovies(currentMovies);
}

//livesearch function
function liveSearch()
{
    const query = document
    .getElementById("search-input")
    .value
    .toLowerCase();

    if(query.trim() === "")
    {
        currentMovies = [...movieData];
        displayMovies(currentMovies.slice(0, visibleMovies));
        return;
    }

    const filtered = movieData.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );

    currentMovies = filtered;
    displayMovies(currentMovies.slice(0, visibleMovies));
}