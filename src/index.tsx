import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./components/style/theme";

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
response => response,
error => {
    if (error.response.status === 401) { // 인가 서버에서 로그인을 하지 않은 경우
        // TODO 모달 출력 등 특정 작업 수행(논의), 현재는 바로 메인 페이지로 이동
        window.location.replace("/"); // 뒤로 가기 실행 시 API 요청을 실패한 페이지로의 이동을 막기 위해 replace 사용
    } else if (error.response.status === 403) { // 인가 서버에서 로그인을 했으나, 부가 정보를 입력하지 않은 경우
        // TODO 모달 출력 등 특정 작업 수행(논의), 현재는 바로 부가 정보 입력 페이지로 이동
        window.location.replace("/welcome");
    }

    return Promise.reject(error);
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();