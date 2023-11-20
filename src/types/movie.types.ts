export type Category = {
  id: string;
  name: string;
};

export type Movie = {
  id: string;
  title: string;
  search_title?: string;
  poster: string;
  release_date: {
    seconds: number;
    nanoseconds: number;
  };
  duration: number;
  video: string;
  description: string;
  status: boolean;
  categoriesId?: string[];
  categories?: Category[];
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
