import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./components/style/theme";

const tokenIsExpired = () => {
  const expiresAtString = sessionStorage.getItem("expires_at");
  if (expiresAtString) {
    const expiresAt = new Date(Date.parse(expiresAtString));

    const now = new Date();
    return now.getTime() >= expiresAt.getTime(); // Access Token 만료 체크
  }

  return false;
};

function issueToken() {
  const refresh_token = sessionStorage.getItem("refresh_token");

  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create();
    console.log("Reissue Token");
    return axiosInstance({
      url: "http://localhost:8081/oauth2/token",
      method: "post",
      params: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      auth: {
        username: "client",
        password: "secret",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const now = new Date();
          const expiresIn = parseInt(response.data.expires_in);
          const expiresAt = new Date(now.getTime() + expiresIn * 1000);

          sessionStorage.setItem("id_token", response.data.id_token);
          sessionStorage.setItem("access_token", response.data.access_token);
          sessionStorage.setItem("refresh_token", response.data.refresh_token);
          sessionStorage.setItem("expires_at", expiresAt.toString());

          resolve(response.data.access_token);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        fetch("http://localhost:8081/logout", { // 토큰 재 발급 실패 시, 로그아웃 처리
          method: "get",
          credentials: "include"
        }).then((res) => {
          if (res.ok) {
            sessionStorage.clear(); // 세션 스토리지 클리어 후
            window.location.href = "/"; // 메인 페이지로 이동
          }
        })
        reject(err);
      });
  });
}

let isRefreshing = false;
let refreshSubscribers: ((access_token: any) => void)[] = [];

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tokenExpired = tokenIsExpired();
    if (tokenExpired && !isRefreshing) {
      isRefreshing = true;

      return issueToken()
        .then((access_token) => {
          config.headers.Authorization = `Bearer ${access_token}`;

          // update subscribers
          refreshSubscribers.forEach((subscriber) => subscriber(access_token));
          refreshSubscribers = [];

          return config;
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    } else if (tokenExpired && isRefreshing) {
      return new Promise((resolve) => {
        refreshSubscribers.push((access_token) => {
          config.headers.Authorization = `Bearer ${access_token}`;
          resolve(config);
        });
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // 인가 서버에서 로그인을 하지 않은 경우
      // TODO 모달 출력 등 특정 작업 수행(논의), 현재는 바로 메인 페이지로 이동
      sessionStorage.clear();
      window.location.replace("/"); // 뒤로 가기 실행 시 API 요청을 실패한 페이지로의 이동을 막기 위해 replace 사용
    } else if (error.response.status === 403) {
      // 인가 서버에서 로그인을 했으나, 부가 정보를 입력하지 않은 경우
      // TODO 모달 출력 등 특정 작업 수행(논의), 현재는 바로 부가 정보 입력 페이지로 이동
      window.location.replace("/welcome");
    }

    return Promise.reject(error);
  }
);

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
