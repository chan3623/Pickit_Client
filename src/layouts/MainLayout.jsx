import { UserAuthContext } from "@/auth/user/UserAuthContext";
import FloatingActions from "@/components/common/floating/FloatingActions";
import Header from "@/components/common/header/Header";
import LoginModal from "@/components/common/login/LoginModal";
import SignupModal from "@/components/common/signup/SignupModal";
import { ENV } from "@/config/env.js";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification.api";

export default function MainLayout() {
  const { account } = useContext(UserAuthContext);
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
      if (response.status === 200) {
        setNotifications(response.data);
      }
    };

    fetchNotifications();
  }, [account]);

  const readNotification = async (notificationId) => {
    const response = await markNotificationAsRead(notificationId);
    console.log("response  : ", response);
    if (response.status === 200) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    }
  };

  return (
    <>
      <Header
        onLoginClick={openLogin}
        notifications={notifications}
        readNotification={readNotification}
      />

      <Outlet />

      <FloatingActions />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={openSignup}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </>
  );
}
