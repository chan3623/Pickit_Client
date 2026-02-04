import { AuthContext } from "@/auth/AuthContext";
import { login } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useContext, useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose, onSignupClick }) {
  const { setUser } = useContext(AuthContext); // 🔹 추가
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

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userRes = await getUser();
      setUser(userRes.data);
    } catch (e) {
      console.log("로그인 실패:", e);
    } finally {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>로그인</h2>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "user" ? styles.active : ""}`}
            onClick={() => handleTabChange("user")}
          >
            일반
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "seller" ? styles.active : ""}`}
            onClick={() => handleTabChange("seller")}
          >
            관리자
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className={styles.formGroup}>
          <label>비밀번호</label>
          <input
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

        <div className={styles.switchText}>
          아직 회원이 아니신가요?
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSignupClick}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
