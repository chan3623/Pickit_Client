import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate('/home')
  }
  return (
    <header className={styles.header}>
      
      <div className={styles.logo} onClick={() => handleClickLogo()}>Pickit</div>

      <nav className={styles.menu}>
        <button>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
            >
              <path
                d="M19 18V18C19 14.4101 16.0899 11.5 12.5 11.5H7.5C3.91015 11.5 1 14.4101 1 18V18"
                stroke="#29292D"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
              <circle
                cx="10"
                cy="5"
                r="4"
                stroke="#29292D"
                stroke-width="1.5"
              ></circle>
            </svg>
            로그인
          </li>
        </button>

        <button>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19.7729 9.04466C18.7255 9.53297 18.0449 10.5718 18.0449 11.9232C18.0449 13.2769 18.7281 14.2937 19.7756 14.7666C19.9383 14.84 20.0704 14.9376 20.1533 15.0347C20.2323 15.1271 20.2499 15.1965 20.2499 15.2463V17C20.2499 18.2426 19.2426 19.25 17.9999 19.25H6C4.75736 19.25 3.75 18.2426 3.75 16.9999V7C3.75 5.75736 4.75736 4.75 6 4.75H17.9999C19.2426 4.75 20.2499 5.75736 20.2499 7V8.55715C20.2499 8.60663 20.2324 8.67653 20.1527 8.7705C20.0692 8.86903 19.9365 8.96842 19.7729 9.04466Z"
                stroke="#29292D"
                stroke-width="1.5"
              ></path>
              <line
                x1="14.75"
                y1="5.75"
                x2="14.75"
                y2="18.25"
                stroke="#29292D"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-dasharray="1 3"
              ></line>
            </svg>
            내 예약
          </li>
        </button>
      </nav>
    </header>
  );
}
