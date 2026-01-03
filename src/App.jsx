import { useEffect, useState } from "react"
import Spinner from "./components/Spinner"
import Search from "./components/Search"
import MovieCard from "./components/MovieCard"
import { useDebounce } from "react-use"
import { getTrendingMovies, updateSearchCount } from "./appwrite"

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}` 
    }
}

const App = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    
    const [movieList, setMovieList] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const [trendingMovies, setTrendingMovies] = useState('')

    // debounce is used to prevent making too many API requests at short amount of time
    // waiting specified time after user stopped typing in ms and then sends API request of user's search term
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true)
        setErrorMessage('')

        try {
            const endpoint = query
            // encodeUriComponent is used for correctly fetching API request, no matter the characters in query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

            const response = await fetch(endpoint, API_OPTIONS)
        
            if(!response.ok) {
                throw new Error('Failed to fetch movies')
            }

            const data = await response.json()

            if(data.response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([])
                return
            }

            setMovieList(data.results || [])

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0])
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`)
            setErrorMessage('Error fetching movies. Please try again later.')
        } finally {
          setIsLoading(false)
        }
    }

    const loadTrendingMovies = async () => {
        try {
          const movies = await getTrendingMovies()

          setTrendingMovies(movies)
        } catch (error) {
          console.error(`Error fetching trending movies: ${error}`)
        }
    }

    // when searched movie query changes, it is fetched through the deps array
    useEffect(() => {
        fetchMovies(debouncedSearchTerm)
    }, [debouncedSearchTerm])

    // using separate useEffect for loading trending movies to not update trending movies every time user searches for something,
    // also leaving dependencies array empty
    useEffect(() => {
        loadTrendingMovies()
    }, [])

    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
            
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>
                
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                // mapping with key is required for precision when deleting, for example, one specific movie from list
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default App