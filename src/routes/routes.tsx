import { Navigate, createBrowserRouter } from "react-router-dom";

import {
  PATH_AUTH,
  PATH_CATEGORIES,
  PATH_DETAIL,
  PATH_LOGIN,
  PATH_MANAGE,
  PATH_MOVIE,
  PATH_MOVIES,
  PATH_NOT_FOUND,
  PATH_REGISTER,
  PATH_ROOT,
  PATH_SEARCH,
  PATH_USERS,
  PATH_WATCH,
} from "./route.paths";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/shared/home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/shared/auth/Login";
import Register from "../pages/shared/auth/Register";
import MovieLayout from "../layouts/MovieLayout/MovieLayout";
import MovieDetail from "../pages/shared/movie/MovieDetail";
import WatchMovie from "../pages/shared/movie/WatchMovie";
import ManageLayout from "../layouts/ManageLayout/ManageLayout";
import ManageCategories from "../pages/manage/ManageCategories";
import ManageMovies from "../pages/manage/ManageMovies";
import ManageUsers from "../pages/manage/ManageUsers";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import MovieNavigator from "../pages/shared/movie/MovieNavigator";
import { ScrollToTop } from "../utils/scrollToTop";
import SearchMovie from "../pages/shared/movie/SearchMovie";
import NotFound from "../pages/shared/NotFound";

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: PATH_ROOT,
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
      {
        path: PATH_NOT_FOUND,
        element: <NotFound />,
      },
      {
        path: PATH_MOVIE,
        element: <MovieLayout />,
        children: [
          {
            path: ":movie_id",
            element: <MovieNavigator />,
            children: [
              {
                path: PATH_DETAIL,
                element: <MovieDetail />,
              },
              {
                path: PATH_WATCH,
                element: <WatchMovie />,
              },
              {
                path: "*",
                element: <Navigate to="/search" replace />,
              },
            ],
          },
          {
            path: PATH_SEARCH,
            element: <SearchMovie />,
          },
        ],
      },
      {
        path: PATH_AUTH,
        element: <AuthLayout />,
        children: [
          {
            path: PATH_LOGIN,
            element: <Login />,
          },
          {
            path: PATH_REGISTER,
            element: <Register />,
          },
        ],
      },
      {
        element: <RequireAuth allowedRole="admin" />,
        children: [
          {
            path: PATH_MANAGE,
            element: <ManageLayout />,
            children: [
              {
                path: PATH_CATEGORIES,
                element: <ManageCategories />,
              },
              {
                path: PATH_MOVIES,
                element: <ManageMovies />,
              },
              {
                path: PATH_USERS,
                element: <ManageUsers />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
