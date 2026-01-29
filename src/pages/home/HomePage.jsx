import HomeList from "../../components/home/HomeList";
import HomeSlide from "../../components/home/HomeSlide";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HomeSlide />
      <HomeList />
    </div>
  );
}
