import LoginForm from "../../components/login/LoginForm";
import { login } from "../../services/login.api";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const handleLogin = async ({ id, password }) => {
    try {
      const res = await login({ id, password });
    } catch (e) {
      console.log("e : ", e);
    }
  };

  return (
    <div className={styles.page}>
      <LoginForm loginBtnClick={handleLogin} />
      <div className={styles.otherLogin}>
        <button className={styles.otherButton}>GUEST</button>
        <button className={styles.otherButton}>VIP</button>
      </div>
    </div>
  );
}
