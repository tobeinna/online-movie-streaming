export type Category = {
  id: string;
  name: string;
};

export type Movie = {
  id: string;
  title: string;
  search_title?: string;
  poster: string;
  poster_path?: string;
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
  categoriesSelectItem?: [
    {
      value: string;
      label: string;
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

export type Comment = {
  id: string;
  movie_id: string;
  uid: string;
  created_date: {
    seconds: number;
    nanoseconds: number;
  };
  content: string;
}