import { AuthContext } from "@/auth/AuthContext";
import { showError, showSuccess } from "@/lib/swal";
import { login } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useContext, useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose, onSignupClick }) {
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, scheduleLogout } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveTab("user");
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      const loginType = activeTab === "admin" ? 1 : 2;

      const res = await login({
        email,
        password,
        loginType,
      });

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      showSuccess("로그인 성공");

      const userRes = await getUser();
      setUser(userRes.data);

      scheduleLogout(accessToken);
    } catch (e) {
      showError(e.customMessage || "로그인 실패");
      console.log("로그인 실패:", e);
    } finally {
      handleClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>

        <h2 className={styles.title}>로그인</h2>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "user" ? styles.active : ""}`}
            onClick={() => handleTabChange("user")}
          >
            일반
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "admin" ? styles.active : ""}`}
            onClick={() => handleTabChange("admin")}
          >
            관리자
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className={styles.formGroup}>
          <label>비밀번호</label>
          <input
            type="password"
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
          <button type="button" className={styles.switchButton} onClick={onSignupClick}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
