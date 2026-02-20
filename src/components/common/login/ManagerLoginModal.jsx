// ManagerLoginModal.jsx
import { ManagerAuthContext } from "@/auth/manager/ManagerAuthContext";
import { showError, showSuccess } from "@/lib/swal";
import { login } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useContext, useState } from "react";
import styles from "./ManagerLoginModal.module.css";

const ACCESS_TOKEN_KEY = "MANAGER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "MANAGER_REFRESH_TOKEN";

export default function ManagerLoginModal({ isOpen, onClose, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAccount, scheduleLogout } = useContext(ManagerAuthContext);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleLogin = async () => {
    try {
      const res = await login({
        email,
        password,
        loginType: 1, // manager
      });

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem("LOGIN_ROLE", "MANAGER");

      // 유저 토큰 제거
      localStorage.removeItem("USER_ACCESS_TOKEN");
      localStorage.removeItem("USER_REFRESH_TOKEN");

      showSuccess("로그인 성공");

      const userRes = await getUser();
      setAccount(userRes.data);
    } catch (e) {
      showError(e.customMessage || "로그인 실패");
      console.error("매니저 로그인 실패:", e);
    } finally {
      handleClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>

        <h2 className={styles.title}>관리자 로그인</h2>

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
