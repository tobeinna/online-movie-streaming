export type Movie = {
  title: string;
  poster: string;
  release_date: Date;
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
};
