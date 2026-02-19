import styles from "@/components/common/login/LoginModal.module.css";
import { showError, showSuccess } from "@/lib/swal";
import { registerUser } from "@/services/user.api";
import { useState } from "react";

export default function SignupModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleSignup = async () => {
    const signupData = { email, password };

    try {
      const response = await registerUser(signupData);

      if (response.status === 201) {
        showSuccess("정상적으로 회원가입 되었습니다.");
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
