import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./components/pages/Home";
import PostForm from "./components/pages/PostForm";
import EditForm from "./components/pages/EditForm";
import FreeBoard from "./components/pages/Board/Free/FreeBoard";
import FreeDetails from "./components/pages/Board/Free/FreeDetails";
import QnABoard from "./components/pages/Board/QnA/QnABoard";
import QnADetail from "./components/pages/Board/QnA/QnADetails";
import RecruitBoard from "./components/pages/Board/Recruit/RecruitBoard";
import RecruitDetails from "./components/pages/Board/Recruit/RecruitDetails";
import MyPage from "./components/pages/MyPage/MyPage";
import Notice from "./components/pages/Notice";
import OAuth2 from "./components/pages/OAuth2";
import Welcome from "./components/pages/Welcome";
import NotFound from "./components/pages/NotFound";
import Layout from "./components/layout/Layout";

function App() {
  return (
    // maxWidth 사이즈 조정
    <Container maxWidth="xl">
      <Routes>
        {/*레이아웃 미적용 컴포넌트*/}
        <Route path="/redirect" element={<OAuth2 />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/authorized" element={<OAuth2 />} />
        {/*레이아웃 적용 컴포넌트*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post" element={<PostForm />} />
          <Route path="edit/:boardType/:id" element={<EditForm />} />
          <Route path="free" element={<FreeBoard />} />
          <Route path="free/:id" element={<FreeDetails />} />
          <Route path="questions" element={<QnABoard />} />
          <Route path="questions/:id" element={<QnADetail />} />
          <Route path="recruit/*" element={<RecruitBoard />} />
          <Route path="recruit/:id" element={<RecruitDetails />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="notice" element={<Notice />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
