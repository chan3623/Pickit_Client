import { ManagerAuthContext } from "@/auth/manager/ManagerAuthContext";
import ManagerHeader from "@/components/common/header/ManagerHeader";
import ManagerLoginModal from "@/components/common/login/ManagerLoginModal";
import ManagerSignupModal from "@/components/common/signup/ManagerSignupModal";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { ENV } from "../config/env";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification.api";

export default function MainLayout() {
  const { account } = useContext(ManagerAuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  // Socket.io 연결
  useEffect(() => {
    if (!account) return;
    const socket = io(`${ENV.API_BASE_URL}`, {
      query: { userId: account.id },
    });

    socket.on("connect", () => console.log("Socket.io 연결됨", socket.id));

    socket.on("notification", (data) => {
      if (data.userId === account.id) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    socket.on("disconnect", () => console.log("Socket.io 연결 해제"));

    return () => {
      socket.disconnect();
    };
  }, [account]);

  useEffect(() => {
    if (!account) return;

    const fetchNotifications = async () => {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    };

    fetchNotifications();
  }, [account]);

  const readNotification = async (notificationId) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    }
  };

  return (
    <>
      <ManagerHeader
        onLoginClick={openLogin}
        notifications={notifications}
        readNotification={readNotification}
      />

      <Outlet />

      <ManagerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={openSignup}
      />

      <ManagerSignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
}
