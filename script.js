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
        </div>
        `;
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
    menu.classList.toggle('show');
}

getMovies();