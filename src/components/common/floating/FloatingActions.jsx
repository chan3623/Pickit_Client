import { useNavigate } from "react-router-dom";
import styles from "./FloatingActions.module.css";

export default function FloatingActions() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToManager = () => {
    navigate("/manager");
  };

  return (
    <div className={styles.container}>
      <button className={styles.topButton} onClick={scrollToTop}>
        TOP
      </button>
      <button className={styles.adminButton} onClick={goToManager}>
        관리자
      </button>
    </div>
  );
}
