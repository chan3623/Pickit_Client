import style from "./DefaultInfo.module.css";

export default function DefaultInfo() {
  return (
    <div className={style.defaultInfoBox}>
      <div className={style.imageBox}>
        <img className={style.image} src="/images/디지몬.webp"></img>
      </div>
      <div className={style.textInnerBox}>
        <h1>디지몬 어드벤쳐 콜라보 카페</h1>
        <span>2026-01-22 - 2026-03-25</span>
        <p>서울 서대문구 연세로 13 신촌 현백화점 U-PLEX B2, 카페 오마케</p>
      </div>
    </div>
  );
}
