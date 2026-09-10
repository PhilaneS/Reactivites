import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/Activities/Form/ActivityForm";
import ActivityDashBoard from "../../features/Activities/ActivityDashBoard/ActivityDashBoard";
import ActivityDetailsPage from "../../features/Activities/Details/ActivityDetailsPage";
import Counter from "../../features/counter/Counter";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginFrom from "../../features/Account/LoginFrom";
import RequireAuth from "./RequireAuth";
import RegisterFrom from "../../features/Account/RegisterForm";
import ProfilePage from "../../features/profiles/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />, children: [
          { path: 'activities', element: <ActivityDashBoard /> },
          { path: 'activities/:id', element: <ActivityDetailsPage /> },
          { path: 'createActivity', element: <ActivityForm key="create" /> },
          { path: 'manage/:id', element: <ActivityForm /> },
          { path: 'profiles/:id', element: <ProfilePage /> },
        ]
      },
      { path: '', element: <HomePage /> },

      { path: 'counter', element: <Counter /> },
      { path: 'errors', element: <TestErrors /> },
      { path: 'not-found', element: <NotFound /> },
      { path: 'login', element: <LoginFrom /> },
      { path: 'register', element: <RegisterFrom /> },
      { path: 'server-error', element: <ServerError /> },
      { path: '*', element: <Navigate replace to='/not-found' /> },

    ]
  }
]);