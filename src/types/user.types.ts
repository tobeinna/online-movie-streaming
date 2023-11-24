export type User = {
  uid?: string;
  displayName: string;
  photoURL?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  role: string;
  status: boolean;
};
