import React, {useContext, useEffect} from 'react'
import Server from "../Assets/server.png"
import { Link } from 'react-router-dom'
import TransferData from '../GeneralJs/TransferData'
import { useNavigate } from 'react-router-dom'
import fetchDataCaller from '../GeneralJs/FetchDataCaller'
import { StorageContext } from '../Context/StorageContext'

function Series(props) {
    const navigate = useNavigate()
    const ContextItems = useContext(StorageContext)


    async function fetchMoreData() {
        try {
            fetchDataCaller(ContextItems.setIsDataLoaded, props.setProgress, ContextItems.setData,ContextItems.movies, ContextItems.setMovies,ContextItems.series,  ContextItems.setSeries,ContextItems.trending, ContextItems.setTrending,ContextItems.recents, ContextItems.setRecents, ContextItems.offset, ContextItems.setOffset)
        } catch (error) {
            console.log('ERROR',error)
            navigate('/error')
        }
    }

    useEffect(() => { //try to set movies, series, and recents in a context state so we dont need to do same operation over and over, This can be done by fetching the resources and performing the necessary operations and setting the context
        if (!ContextItems.isDataLoaded) {
            fetchDataCaller(ContextItems.setIsDataLoaded, props.setProgress, ContextItems.setData, ContextItems.movies, ContextItems.setMovies,ContextItems.series, ContextItems.setSeries,ContextItems.trending,  ContextItems.setTrending,ContextItems.recents, ContextItems.setRecents, ContextItems.offset, ContextItems.setOffset)
            ContextItems.setIsDataLoaded(true)
        }
    }, [])

    return (
        <>
            {
                ContextItems.series.length > 0 &&
                <>
                    <div className="series-container">
                        <div className="wrapper-series">
                            <div className="carousel-series">
                                {
                                    ContextItems.series.map((element) => {
                                        return (
                                            <Link onClick={() => { TransferData(element) }} to={`/information/${element.netflix_id}`} key={element.netflix_id} className="series-item info-to-store">
                                                <div className="series-poster">
                                                    {element.poster.length > 3 ? <img src={element.poster} alt="poster" /> : <img src={Server} alt="poster" />}
                                                </div>
                                                <div className="series-info">
                                                    <div className="series-name-rating-container">
                                                        <div className="series-name">
                                                            {element.title.length > 0 ? element.title : '--'}
                                                        </div>
                                                        <div className="series-rating">
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
                    <div className="movie-show-more-btn-container">
                        <button onClick={fetchMoreData} className="movie-show-more-btn">
                            <span>Show More</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </button>
                    </div>
                </>
            }
        </>
    )
}

export default Series