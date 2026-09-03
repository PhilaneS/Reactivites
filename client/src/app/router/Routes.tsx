import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/Activities/Form/ActivityForm";
import ActivityDashBoard from "../../features/Activities/ActivityDashBoard/ActivityDashBoard";
import ActivityDetailsPage from "../../features/Activities/Details/ActivityDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
        { path:'', element: <HomePage /> },
        { path: 'activities',element: <ActivityDashBoard/>},
        { path: 'activities/:id',element: <ActivityDetailsPage/>},
        { path: 'createActivity',element: <ActivityForm key="create" />},
        { path: 'manage/:id',element: <ActivityForm/>}

    ]
  }
]);