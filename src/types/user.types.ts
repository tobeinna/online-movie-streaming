export type User = {
  uid?: string;
  displayName: string;
  search_displayName?: string;
  photoURL?: string;
  photo_path?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  role: string;
  status: boolean;
};
