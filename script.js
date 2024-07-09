const apiKey = '531f5cc3';
let topMovies = [];
let bottomMovies = [];
let searchResults = [];

// debounce fonksiyonu
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  loadTopMovies();
  document.getElementById('searchInput').addEventListener('input', debounce(handleSearchInput, 500));
});

async function loadTopMovies() {
  try {
    const response = await fetch(`http://www.omdbapi.com/?s=top&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
      topMovies = data.Search.slice(0, 5);
      bottomMovies = data.Search.slice(5, 10);
      displayMovies(topMovies, 'topMoviesContainer');
      displayMovies(bottomMovies, 'bottomMoviesContainer');
    } else {
      alert('Popüler filmler yüklenemedi!');
    }
  } catch (error) {
    console.error('Veri alınırken bir hata oluştu:', error);
    alert('Veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

async function searchMovies(query) {
  if (!query) {
    return;
  }

  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
      searchResults = data.Search;
      displaySearchResults(searchResults);
    } else {
      
    }
  } catch (error) {
    console.error('Veri alınırken bir hata oluştu:', error);
    alert('Veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

function displayMovies(movies, containerId) {
  const movieContainer = document.getElementById(containerId);
  movieContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    movieElement.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="detaylar" onclick="getMovieDetails('${movie.imdbID}')">Detayları Gör</button>
    `;

    movieContainer.appendChild(movieElement);
  });
}

function displaySearchResults(movies) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('search-result-item');
    movieElement.dataset.imdbid = movie.imdbID;

    movieElement.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
      <span>${movie.Title}</span>
    `;

    movieElement.addEventListener('click', () => {
      getMovieDetails(movie.imdbID);
      clearSearchResults();
    });

    searchResultsContainer.appendChild(movieElement);
  });
}

async function getMovieDetails(imdbID) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
      displayMovieDetails(data);
    } else {
      alert('Film detayları bulunamadı.');
    }
  } catch (error) {
    console.error('Veri alınırken bir hata oluştu:', error);
    alert('Veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

function displayMovieDetails(movie) {
  const movieDetailsContainer = document.createElement('div');
  movieDetailsContainer.classList.add('movie-details');

  movieDetailsContainer.innerHTML = `
    <h2>${movie.Title}</h2>
    <p><strong>IMDb Puanı:</strong> ${movie.imdbRating}</p>
    <p><strong>Metascore:</strong> ${movie.Metascore}</p>
    <p><strong>Süre:</strong> ${movie.Runtime}</p>
    <p><strong>Konu:</strong> ${movie.Plot}</p>
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
  `;

  const movieContainer = document.getElementById('topMoviesContainer');
  movieContainer.innerHTML = '';
  movieContainer.appendChild(movieDetailsContainer);
}

function showHomePage() {
  displayMovies(topMovies, 'topMoviesContainer');
  displayMovies(bottomMovies, 'bottomMoviesContainer');
}

function handleSearchInput(event) {
  const query = event.target.value.trim();
  searchMovies(query);
}

function clearSearchResults() {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';
}