import { useState } from "react";
import style from "./LoginForm.module.css";

export default function LoginForm({ loginBtnClick }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={style.loginBox}>
      <h1 className={style.title}>Login</h1>
      <div className={style.inputBox}>
        <p>아이디</p>
        <input
          name="id"
          type="text"
          placeholder="아이디를 입력해주세요."
          onChange={(e) => setId(e.target.value)}
        ></input>
      </div>
      <div className={style.inputBox}>
        <p>비밀번호</p>
        <input
          name="pw"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className={style.loginBtnBox}>
        <div className={style.btnInnerBox}>
          <button onClick={() => loginBtnClick({ id, password })}>Login</button>
        </div>
      </div>
    </div>
  );
}
