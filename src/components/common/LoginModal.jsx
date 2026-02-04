import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("user");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setId("");
    setPassword("");
  };

  const handleLogin = () => {
    const loginData = {
      id,
      password,
      userType: activeTab,
    };

    console.log("Login Attempt:", loginData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>로그인</h2>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "user" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("user")}
          >
            일반 회원
          </button>

          <button
            className={`${styles.tabButton} ${
              activeTab === "seller" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("seller")}
          >
            셀러 회원
          </button>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-id">아이디</label>
          <input
            id="login-id"
            type="text"
            placeholder="아이디를 입력해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
}
