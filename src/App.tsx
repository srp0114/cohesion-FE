import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import BoardWrite from "./components/pages/PostForm";
import FreeBoard from "./components/pages/Board/Free/FreeBoard";
import FreeDetails from "./components/pages/Board/Free/FreeDetails";
import QnABoard from "./components/pages/Board/QnA/QnABoard";
import QnADetail from "./components/pages/Board/QnA/QnADetails";
import RecruitBoard from "./components/pages/Board/Recruit/RecruitBoard";
import RecruitDetails from "./components/pages/Board/Recruit/RecruitDetails";
import MyPage from "./components/pages/MyPage";
import Notice from "./components/pages/Notice";
import OAuth2 from "./components/pages/OAuth2";
import NotFound from "./components/pages/NotFound";

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
          <Route path="/recruit/:id" element={<RecruitDetails />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/redirect" element={<OAuth2 />} />
          <Route path="/authorized" element={<OAuth2 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
