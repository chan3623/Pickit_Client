import ManagerHeader from "@/components/common/header/ManagerHeader";
import ManagerLoginModal from "@/components/common/login/ManagerLoginModal";
import ManagerSignupModal from "@/components/common/signup/ManagerSignupModal";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  return (
    <>
      <ManagerHeader onLoginClick={openLogin} />

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
