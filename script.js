const API_KEY = 'cc6be9344c3535221497d244fe2f7ff2';
const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

let movieData = []; 

// Fetch Data from TMDB
async function getMovies() {
try {
    const res = await fetch(API_URL);
    const data = await res.json();
    movieData = data.results;

    displayMovies(movieData);
    if (typeof setupGenres === 'function') setupGenres(movieData);
    } catch (error) {
    console.error('Error fetching movies:', error);
    }
}

// Render Movies to the Container
function displayMovies(movies) {
    const container = document.getElementById('movie-container');
    container.innerHTML = '';

    movies.forEach(movie => {
        const { title, poster_path, vote_average, release_date } = movie;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card'); 

        movieElement.innerHTML = `
        <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/500x750'}" alt="${title}">
        <div class="movie-info">
        <h3>${title}</h3>
        <span class="rating">${vote_average}</span>
        <p>${release_date ? release_date.split('-')[0] : 'N/A'}</p>
        <button onclick="addToFavourites('${movie.id}')"> 
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
            </svg>
        </button>
        </div>
        `;
        container.appendChild(movieElement);
    });

    movieElement.onclick = () => showMovieDetails(movie);
}

// Search Movies (Local Filter)
function searchMovies() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredMovies = movieData.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);
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

getMovies();

//login
function login()
{
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (email === "bob@mail.com" && password === "bobpass")
    {
        localStorage.setItem("loggedIn", true);
        window.location.href = "index.html";
    }
    else
    {
        alert("Invalid login");
    }
}

function addToFavourites()
{
    let favs = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favs.includes(id))
    {
        favs.push(id);
        localStorage.setItem("favourites", JSON.stringify(favs));
        alert("Added to favourites");
    }
}

//movie modal
function showMovieDetails(movie)
{
    const modal = document.getElementById("movie-modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${IMG_PATH + movie.poster_path}">
    <p>${movie.overview}</p>
    <button onclick="closeModal()">close</button>
    `;

    modal.classList.add("show");
}

function closeModal()
{
    document.getElementById("movie-modal").classList.remove("show");
}