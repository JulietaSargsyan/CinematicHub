const repoName = '/CinematicHub';

const global = {
    currentPage: window.location.pathname.replace(repoName, ''),
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    // Below is my api key, please don't steal it or else I'll find you and it'll not end good... It's free to get one on https://www.themoviedb.org/.
    const API_KEY = 'ccc6c673ce7bff9613e19f0bfe5727d4';
    const API_URL = 'https://api.themoviedb.org/3/';

    setSpinner('show');

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    setSpinner('hide');

    return data;
}

// Single Movie Card
function createMovieCard(movie, type) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Link
  const link = document.createElement('a');
  link.href = type ==='movie' ? `movie-details.html?id=${movie.id}` : `tv-details.html?id=${movie.id}`;

  // Image
  const img = document.createElement('img');
  img.classList.add('card-img-top');
  img.alt = movie?.title || movie?.name;
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
  title.textContent = movie?.title || movie?.name;

  const release = document.createElement('p');
  release.classList.add('card-text');

  const small = document.createElement('small');
  small.classList.add('text-muted');
  small.textContent = `Release: ${movie.release_date || movie.first_air_date || 'Unknown'}`;

  release.appendChild(small);
  cardBody.appendChild(title);
  cardBody.appendChild(release);
  card.appendChild(cardBody);

  return card;
}

// Display popular movies/tv-shows
async function displayPopularMoviesORShows(endpoint, elementID, type) {
    const { results } = await fetchAPIData(endpoint);
    const container = document.getElementById(elementID);
    results.forEach((movie => container.appendChild(createMovieCard(movie, type))))
}

// Display movie/tvShow detail
async function displayDetails(type) {
    const id = window.location.search.split('=')[1];

    const item = await fetchAPIData(`${type}/${id}`);
    console.log(item)
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src=${`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              class="card-img-top"
              alt=${item.title}
            />
          </div>
          <div>
            <h2>${item.title || item.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${item.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${item.release_date || item.first_air_date}</p>
            <p>${item.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${item.genres.map((genre) =>  `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${item.homepage}" target="_blank" class="btn">Visit Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>${type} Info</h2>
          ${type === 'movie' ? 
          `<ul>
            <li><span class="text-secondary">Budget:</span> $${addCommas(item.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommas(item.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${item.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${item.status}</li>
          </ul>`
          :
          `<ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${item.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${item.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> Released</li>
          </ul>`
          }
          <h4>Production Companies</h4>
          <div class="list-group">${item.production_companies.map((company) =>  `<span>${company.name}</span>`).join(', ')}</div>
        </div>
    `;

   const detailsPage = document.getElementById(`${type}-details`);
   console.log(detailsPage)
   const bgImage = document.querySelector(`.${type}Background`);
   bgImage.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`;
   detailsPage.appendChild(div);

}

// Highlight active link
function highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(navLinks)
    navLinks.forEach(navLink => navLink.getAttribute('href') === global.currentPage && navLink.classList.add('active'));
}

function setSpinner(state) {
    switch (state) {
        case 'show':
            document.querySelector('.spinner').classList.add('show')
            break;
        case 'hide':
            document.querySelector('.spinner').classList.remove('show')
            break;
        default:
            break;
    }
}

function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init() {
    console.log(global.currentPage)
    highlightActiveLink();
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMoviesORShows('movie/popular', 'popular-movies', 'movie');
            break;
        case '/shows.html':
            displayPopularMoviesORShows('tv/popular', 'popular-shows', 'tv');
            break;
        case '/movie-details.html':
            displayDetails('movie');
            break;
        case '/tv-details.html':
            displayDetails('tv')
            break;
        case '/search.html':
            console.log('search');
            break;  
    }
}

init();
