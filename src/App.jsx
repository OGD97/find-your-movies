import React, { useState, useEffect } from 'react'
import Search from './components/Search';
import Loading from './components/Loading';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


//debounce the search term to prevent making too many API request
//by waiting for the user to stop typing for .5 sec
  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
  try {
    // /discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc
    const endpoint = query 
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);
    // alert(response);

    // throw new Error('Failed to fetch movies');

    if(!response.ok) {
          throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    if(data.Response === 'False') {
      setErrorMessage(data.Error || 'Failed to fetch movies');
      setMovieList([]);
      return;
    }

    setMovieList(data.results || []);

  } catch (error) {
    console.error(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies. Please try again later.');
  } finally {
    setIsLoading(false);
  }
}
  
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  
return (
  <main>
    <title>Popcorn Time 🍿</title>
  

    <div className="wrapper">
      <header>
       <img src="./hero.png" alt="hero banner" className='w-70 md:w-70 lg:w-70' />
        <h1>Find Your <span className="text-gradient">Movie</span> Rating</h1>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </header>

  <section className="all-movies">
  <h2 className='mt-[20px]'>All Movies</h2>

  {/* {errorMessage && <p className='text-red-500'>{errorMessage}</p>} */}

  {isLoading ? (
    <Loading/>
  ) : errorMessage ? (
    <p className='text-red-500'>{errorMessage}</p>
  ) : (
    <ul>
      {movieList.map((movie) => (
        <MovieCard key={movie.id} movie={movie}/>
      ))}
    </ul>
  )
}
  </section>
      {/* <h3 className='text-white wrapper'>{searchTerm}</h3> */}

    </div>
  </main>
)
}

export default App