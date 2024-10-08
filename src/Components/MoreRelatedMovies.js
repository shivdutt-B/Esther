import React from 'react'
import Server from "../Assets/server.png"
import { Link } from 'react-router-dom'
import TransferData from '../GeneralJs/TransferData'
import { useEffect, useContext } from 'react'
import GenreAndMovieFetcher from '../GeneralJs/GenreAndMovieFetcher'
import { StorageContext } from '../Context/StorageContext'
import { useNavigate } from 'react-router-dom'
import loadingScreen from "../GeneralJs/LoadingMoviesAndSeries"


function Movie() {
    const ContextItems = useContext(StorageContext)
    const navigate = useNavigate()

    async function fetchMore() {
        try {
            let fetchedData = await GenreAndMovieFetcher(navigate, ContextItems.movieAndSeriesOffset, ContextItems.setMovieAndSeriesOffset, ContextItems.relatedMovesOffset, ContextItems.setRelatedMoviesOffset, ContextItems.relatedSeriesOffset, ContextItems.setRelatedSeriesOffset, ContextItems.setRelatedMoviesMaxLimit, ContextItems.setRelatedSeriesMaxLimit)

            let movies = fetchedData.filter((element) => {
                return element.title_type === 'movie'
            })
            let series = fetchedData.filter((element) => {
                return element.title_type === 'series'
            })
            let existingMovies = ContextItems.relatedMovies
            let existingSeries = ContextItems.relatedSeries
            ContextItems.setRelatedMovies(existingMovies.concat(movies))
            ContextItems.setRelatedSeries(existingSeries.concat(series))
        } catch (error) {
            navigate('/error')
        }
    }
    const fetchData = async () => {
        try {
            if (ContextItems.relatedMovies.length == 0 && ContextItems.relatedSeries.length == 0) {
                let fetchedData = await GenreAndMovieFetcher(navigate, ContextItems.movieAndSeriesOffset, ContextItems.setMovieAndSeriesOffset, ContextItems.relatedMovesOffset, ContextItems.setRelatedMoviesOffset, ContextItems.relatedSeriesOffset, ContextItems.setRelatedSeriesOffset, ContextItems.setRelatedMoviesMaxLimit, ContextItems.setRelatedSeriesMaxLimit)

                let movies = fetchedData.filter((element) => {
                    return element.title_type === 'movie'
                })
                console.log('REL MOVIES', movies)
                let series = fetchedData.filter((element) => {
                    return element.title_type === 'series'
                })
                ContextItems.setRelatedMovies(movies)
                ContextItems.setRelatedSeries(series)
            }
            else {
                // Data is already there no need to fetch again.
            }
        } catch (e) {
            navigate('/error')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            {ContextItems.relatedMovies.length > 0 ?
                <>
                    <div className="movie-container">
                        <div className="wrapper-movie">
                            <div className="carousel-movie">
                                {
                                    ContextItems.relatedMovies.map((element) => {
                                        return (
                                            <Link onClick={() => { TransferData(navigate, element, ContextItems.setRelatedMovies, ContextItems.setRelatedSeries) }} to={`/information/${element.netflix_id}`} key={element.netflix_id} className="movie-item info-to-store">
                                                <div className="movie-poster">
                                                    {element.poster.length > 3 ? <img src={element.poster} alt="poster" /> : <img src={Server} alt="poster" />}
                                                </div>
                                                <div className="movie-info">
                                                    <div className="movie-name-rating-container">
                                                        <div className="movie-name">
                                                            {element.title.length > 0 ? element.title : '--'}
                                                        </div>
                                                        <div className="movie-rating">
                                                            {element.rating.length > 0 ? element.rating : "--"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {
                        ContextItems.relatedMovesOffset < ContextItems.relatedMoviesMaxLimit ?
                            <div className="movie-show-more-btn-container">
                                <button onClick={fetchMore} className="movie-show-more-btn">
                                    <span>Show More</span>
                                    <i class="fa-solid fa-angle-down"></i>
                                </button>
                            </div>
                            :
                            <div className="movie-show-more-btn-container">
                                <button className="movie-show-more-btn">
                                    <span>Thats all</span>
                                </button>
                            </div>
                    }
                </>
                :
                <>
                    {
                        loadingScreen()
                    }
                </>
            }
        </>
    )
}

export default Movie