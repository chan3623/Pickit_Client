import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import LoginModal from "../components/common/LoginModal";

export default function MainLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Header onLoginClick={handleOpenLoginModal} />
      <Outlet />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
}
