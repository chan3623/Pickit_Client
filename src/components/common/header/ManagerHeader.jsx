import { ManagerAuthContext } from "@/auth/manager/ManagerAuthContext";
import { showSuccess } from "@/lib/swal";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerHeader.module.css";

export default function ManagerHeader({
  onLoginClick,
  notifications,
  readNotification,
}) {
  const { account, handleLogout } = useContext(ManagerAuthContext);
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userBoxRef = useRef(null);
  const notifBoxRef = useRef(null);

  const unreadCount = useMemo(() => {
    const count = notifications.filter((n) => !n.isRead).length;
    return count > 99 ? "99+" : count;
  }, [notifications]);

  const handleClickLogo = () => {
    navigate("/manager");
  };

  const handleLoginClick = () => {
    if (!account) onLoginClick();
  };

  const handleToggleLogout = () => {
    if (!account) return;
    setIsLogoutOpen((prev) => !prev);
  };

  const handleToggleNotifications = () => {
    setIsNotifOpen((prev) => !prev);
  };

  const handleClickLogout = () => {
    handleLogout("manual");
    showSuccess("로그아웃 되었습니다.");
    setIsLogoutOpen(false);
    navigate("/manager");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userBoxRef.current && !userBoxRef.current.contains(e.target)) {
        setIsLogoutOpen(false);
      }

      if (notifBoxRef.current && !notifBoxRef.current.contains(e.target)) {
        setIsNotifOpen(false);
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
        {/* 사용자 */}
        <div className={styles.userBox} ref={userBoxRef}>
          <button
            className={styles.userButton}
            onClick={account ? handleToggleLogout : handleLoginClick}
          >
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
              <path
                d="M19 18V18C19 14.4101 16.0899 11.5 12.5 11.5H7.5C3.91015 11.5 1 14.4101 1 18V18"
                stroke="#29292D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="5" r="4" stroke="#29292D" strokeWidth="1.5" />
            </svg>

            <span className={styles.userText}>
              {account?.email || "로그인"}
            </span>
          </button>

          {account && isLogoutOpen && (
            <div className={styles.logoutDropdown}>
              <button
                className={styles.logoutButton}
                onClick={handleClickLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        {/* 알림 */}
        {account && (
          <div className={styles.notificationBox} ref={notifBoxRef}>
            <button
              onClick={handleToggleNotifications}
              className={styles.notifButton}
            >
              <span className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C6 2 6 6 6 6V11L4 13V14H16V13L14 11V6C14 6 14 2 10 2Z"
                    stroke="#29292D"
                    strokeWidth="1.5"
                  />
                </svg>

                {notifications.length > 0 && (
                  <span className={styles.notifCount}>{unreadCount}</span>
                )}
              </span>

              <span className={styles.notifText}>알림</span>
            </button>

            {isNotifOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <span>알림</span>
                  <span>{unreadCount}개 읽지 않음</span>
                </div>

                <div className={styles.notifList}>
                  {notifications.length === 0 ? (
                    <div className={styles.notifEmpty}>알림이 없습니다.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() =>
                          !notif.isRead && readNotification(notif.id)
                        }
                        className={`${styles.notifItem} ${
                          !notif.isRead ? styles.unread : ""
                        }`}
                      >
                        {notif.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
