// LoginModal.jsx
import { useUserAuth } from "@/auth/user/useUserAuth";
import { showError, showSuccess } from "@/lib/swal";
import { login } from "@/services/auth.api";
import { getUser } from "@/services/user.api";
import { useState } from "react";
import styles from "./LoginModal.module.css";

const ACCESS_TOKEN_KEY = "USER_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "USER_REFRESH_TOKEN";

export default function LoginModal({ isOpen, onClose, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAccount, scheduleLogout } = useUserAuth();

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
        loginType: 2,
      });

      const { accessToken, refreshToken } = res.data;

      // ✅ Provider와 동일한 키 사용
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem("LOGIN_ROLE", "USER");

      // 관리자 토큰 제거
      localStorage.removeItem("MANAGER_ACCESS_TOKEN");
      localStorage.removeItem("MANAGER_REFRESH_TOKEN");

      // ✅ 사용자 정보 세팅
      const userRes = await getUser();
      setAccount(userRes.data);

      showSuccess("로그인 성공");
      handleClose();
    } catch (e) {
      showError(e.customMessage || "로그인 실패");
      console.log("로그인 실패:", e);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>

        <h2 className={styles.title}>로그인</h2>

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
