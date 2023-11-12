import MovieCard from "../MovieCard/MovieCard"

const HomeMovieList = () => {
  return (
    <div className="w-5/6 mx-auto">
      <h1 className="text-2xl font-bold text-slate-200">Movies</h1>
      <div className="card-list flex justify-between my-6">
        <MovieCard movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCard movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCard movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCard movie_id="ororYwNrXaxhbnzfPRrO" />
      </div>
    </div>
  )
}

export default HomeMovieList