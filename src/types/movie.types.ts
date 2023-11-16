export type Movie = {
  title: string;
  poster: string;
  release_date: {
    seconds: number;
    nanoseconds: number;
  };
  duration: number;
  video: string;
  description: string;
  status: boolean;
  categories?: [
    {
      id: string;
      name: string;
    },
  ];
  votes?: [
    {
      uid: string;
      voted: number;
    },
  ];
  comments?: [
    {
      uid: string;
      comment: string;
      date: Date;
    },
  ];
  averageVote?: number;
};
