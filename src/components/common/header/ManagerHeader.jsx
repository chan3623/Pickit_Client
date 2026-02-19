// Header.jsx
import { ManagerAuthContext } from "@/auth/manager/ManagerAuthContext";
import { showSuccess } from "@/lib/swal";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerHeader.module.css";

export default function ManagerHeader({ onLoginClick }) {
  const { account, logout } = useContext(ManagerAuthContext);
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const userBoxRef = useRef(null);

  const handleClickLogo = () => {
    navigate("/manager");
  };

  const handleLoginClick = () => {
    if (!account) {
      onLoginClick();
    }
  };

  const handleToggleLogout = () => {
    if (!account) return;
    setIsLogoutOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout("manual");
    showSuccess("로그아웃 되었습니다.");
    setIsLogoutOpen(false);
    navigate("/manager");
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
        setIsLogoutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleClickLogo}>
        Pickit Manager
      </div>

      <nav className={styles.menu}>
        {/* 이메일 영역 */}
        <div className={styles.userBox} ref={userBoxRef}>
          <button
            className={styles.userButton}
            onClick={account ? handleToggleLogout : handleLoginClick}
          >
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="5"
                  r="4"
                  stroke="#29292D"
                  strokeWidth="1.5"
                />
              </svg>
              {account?.email || "로그인"}
            </li>
          </button>

          {account && isLogoutOpen && (
            <div className={styles.logoutDropdown}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
