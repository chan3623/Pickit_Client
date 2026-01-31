import style from "./DetailInfo.module.css";

export default function DetailInfo() {

  return (
    <div className={style.detailBox}>
      <div className={style.titleInnerBox}>
        <h2>팝업스토어 소개</h2>

         <div className={style.telInnerBox}>
          <p>* 문의사항 </p>
          <p>010-1111-2222</p>
         </div>
      </div>

      <div className={style.textBox}>
        ✧･ﾟ: ✧･ﾟ:  :･ﾟ✧:･ﾟ✧<br/>
        IPARK 용산점에서 다시 한 번 더 도파민 UP‼️💫<br/>
        ✔️기간 : 12/1(월) - 1/31(토)<br/>
        ✔️오픈시간:<br/>
        월-목일 AM 10:30-PM 8:30<br/>
        금토 AM 10:30-PM 9:00<br/>
        다시 한번💫연도문구 팝업스토어<br/>
        IPARK 용산점 도파민 스테이션 𝙊.𝙋.𝙀.𝙉..𖤐<br/>
        담곰이, 먼작귀, 다마고치 한국 오리지널 신상들과 함께 소소한 일상의 행운을 가져다줄 특별한 아이템들을 만나보세요!<br/>
        진행하는 이벤트들은 순차적으로 공지합니다✌️
      </div>
    </div>
  );
}
