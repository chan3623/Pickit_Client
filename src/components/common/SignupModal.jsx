import { registerAdmin, registerUser } from "@/services/auth.api";
import { showSuccess, showError } from "@/utils/swal";
import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function SignupModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleSignup = async () => {
    const signupData = { email, password };

    try {
      const response =
        activeTab === "user"
          ? await registerUser(signupData)
          : await registerAdmin(signupData);

      if(response.status === 201){
        showSuccess("정상적으로 회원가입 되었습니다.")
        handleClose();
      }

    } catch (error) {
      showError(error.customMessage);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>

        <h2 className={styles.title}>회원가입</h2>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "user" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("user")}
          >
            일반
          </button>

          <button
            className={`${styles.tabButton} ${
              activeTab === "admin" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("admin")}
          >
            관리자
          </button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-email">이메일</label>
          <input
            id="signup-email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
          />
        </div>

        <button className={styles.loginButton} onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}
