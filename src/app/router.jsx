import ManagerAuthProvider from "@/auth/manager/ManagerAuthProvider";
import UserAuthProvider from "@/auth/user/UserAuthProvider";
import MainLayout from "@/layouts/MainLayout";
import ManagerLayout from "@/layouts/ManagerLayout";
import DetailPage from "@/pages/detail/DetailPage";
import EditPopupPage from "@/pages/edit/EditPopupPage";
import HomePage from "@/pages/home/HomePage";
import ManagerPage from "@/pages/manager/ManagerPage";
import MyReservationPage from "@/pages/myreservation/MyReservationPage";
import NewPopupPage from "@/pages/new/NewPopupPage";
import ReservationPage from "@/pages/reservation/ReservationPage";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    element: (
      <UserAuthProvider>
        <MainLayout />
      </UserAuthProvider>
    ),
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
  {
    element: (
      <ManagerAuthProvider>
        <ManagerLayout />
      </ManagerAuthProvider>
    ),
    children: [
      {
        path: "/manager",
        element: <ManagerPage />,
      },
      {
        path: "/new",
        element: <NewPopupPage />,
      },
      {
        path: "/edit",
        element: <EditPopupPage />,
      },
    ],
  },
]);
