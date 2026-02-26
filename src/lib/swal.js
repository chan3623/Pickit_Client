import Swal from "sweetalert2";

/**
 * 성공 알림
 * @param {string} title 제목
 * @param {string} text 내용
 * @param {number} timer 자동 닫힘 시간(ms)
 */
export const showSuccess = (title = "성공", text = "", timer = 1500) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    timer,
    showConfirmButton: false,
  });
};

/**
 * 실패 알림
 * @param {string} title 제목
 * @param {string} text 내용
 */
export const showError = (title = "실패", text = "") => {
  Swal.fire({
    icon: "error",
    title,
    text,
  });
};

/**
 * 확인/취소 선택
 * @param {string} title 제목
 * @param {string} text 내용
 * @returns {Promise<boolean>} 확인(true) / 취소(false)
 */
export const showWarning = async (title = "확인", text = "") => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  return result.isConfirmed;
};

/**
 * 확인/취소 선택
 * @param {string} title 제목
 * @param {string} text 내용
 * @returns {Promise<boolean>} 확인(true) / 취소(false)
 */
export const showConfirm = async (title = "확인", text = "") => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  return result.isConfirmed;
};
/**
 * 정보 알림
 * @param {string} title 제목
 * @param {string} text 내용
 * @param {number} timer 자동 닫힘 시간(ms)
 */
export const showInfo = (title = "알림", text = "", timer = 0) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    timer, // 0이면 자동으로 닫히지 않음
    showConfirmButton: true, // 확인 버튼 표시
    timerProgressBar: false, // 자동 닫힘 없으므로 필요 없음
  });
};
