const global = {
    currentPage: window.location.pathname,
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    // Below is my api key, please don't steal it or else I'll find you and it'll not end good... It's free to get one on https://www.themoviedb.org/.
    const API_KEY = 'ccc6c673ce7bff9613e19f0bfe5727d4';
    const API_URL = 'http://api.themoviedb.org/3/';

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();
    return data;
}

// Single Movie Card
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Link
  const link = document.createElement('a');
  link.href = `movie-details.html?id=${movie.id}`;

  // Image
  const img = document.createElement('img');
  img.classList.add('card-img-top');
  img.alt = movie.title;
  img.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'images/no-image.jpg';

  link.appendChild(img);
  card.appendChild(link);

  // Card body
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = movie.title;

  const release = document.createElement('p');
  release.classList.add('card-text');

  const small = document.createElement('small');
  small.classList.add('text-muted');
  small.textContent = `Release: ${movie.release_date || 'Unknown'}`;

  release.appendChild(small);
  cardBody.appendChild(title);
  cardBody.appendChild(release);
  card.appendChild(cardBody);

  return card;
}

async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');
    const container = document.getElementById('popular-movies');
    results.forEach((movie => container.appendChild(createMovieCard(movie))))
}

// Highlight active link
function highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(navLinks)
    navLinks.forEach(navLink => navLink.getAttribute('href') === global.currentPage && navLink.classList.add('active'));
}

function init() {
    highlightActiveLink();
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            console.log('Shows')
            break;
        case '/movie-details.html':
            console.log('TV details')
            break;
        case '/tv-details.html':
            console.log('tv details');
            break;
        case '/search.html':
            console.log('search');
            break;  
    }
}

init();
