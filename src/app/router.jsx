import MainLayout from "@/layouts/MainLayout";
import DetailPage from "@/pages/detail/DetailPage";
import HomePage from "@/pages/home/HomePage";
// import LoginPage from "@/pages/login/LoginPage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ReservationPage from "../pages/reservation/ReservationPage";
import MyReservationPage from "../pages/myreservation/MyReservationPage"; // Import MyReservationPage
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/detail/:id",
        element: <DetailPage />,
      },
      {
        path: "/reservation",
        element: <ReservationPage />,
      },
      {
        path: "/myreservations",
        element: <MyReservationPage />,
      },
    ],
  },
]);
