import FloatingActions from "@/components/common/floating/FloatingActions";
import Header from "@/components/common/header/Header";
import LoginModal from "@/components/common/login/LoginModal";
import SignupModal from "@/components/common/signup/SignupModal";
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
      <Header onLoginClick={openLogin} />

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
