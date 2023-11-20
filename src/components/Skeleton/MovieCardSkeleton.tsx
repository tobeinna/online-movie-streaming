const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col w-[250px] animate-pulse mx-auto">
      <div className="image movie-card relative mx-auto bg-center bg-cover bg-no-repeat rounded-2xl flex flex-col justify-end overflow-hidden bg-gray-500"></div>
      <div className="flex justify-between mt-6">
        <div className="h-4 w-24 bg-gray-500 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-500 rounded-full"></div>
      </div>
      <div className="mt-4 h-4 w-full bg-gray-500 rounded-full"></div>
    </div>
  );
};

export default MovieCardSkeleton;
