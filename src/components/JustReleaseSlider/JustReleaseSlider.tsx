import MovieCardVertical from "../MovieCardVertical/MovieCardVertical";

const JustReleaseSlider = () => {
  return (
    <div className="w-5/6 mx-auto">
      <h1 className="text-2xl font-bold text-slate-200">Just Release</h1>
      <div className="card-list flex">
        <MovieCardVertical movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCardVertical movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCardVertical movie_id="ororYwNrXaxhbnzfPRrO" />
        <MovieCardVertical movie_id="ororYwNrXaxhbnzfPRrO" />
      </div>
    </div>
  );
};

export default JustReleaseSlider;
