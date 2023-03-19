import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import BoardWrite from "./components/pages/BoardWritePage";
import FreeBoard from "./components/pages/Board/Free/FreeBoard";
import FreeDetails from "./components/pages/Board/Free/FreeDetails";
import QnABoard from "./components/pages/Board/QnABoard";
import QnADetail from "./components/pages/Board/QnADetails";
import RecruitBoard from "./components/pages/Board/RecruitBoard";
import MyPage from "./components/pages/MyPage";
import Notice from "./components/pages/Notice";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="post" element={<BoardWrite />} />
          <Route path="/free" element={<FreeBoard />} />
          <Route path="/free/:id" element={<FreeDetails />} />
          <Route path="/questions" element={<QnABoard />} />
          <Route path="/questions/:id" element={<QnADetail />} />
          <Route path="/recruit/*" element={<RecruitBoard />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;