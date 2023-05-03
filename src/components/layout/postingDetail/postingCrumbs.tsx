import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";

export enum PageName {
  free= "자유게시판",
  questions= "Q&A게시판",
  recruit= "모집게시판",
  notice= "공지사항",
  mypage= "마이페이지",
  post= "게시글 작성"
};

interface PostingCrumbsProps {
  title: string;
  board: "free" | "questions" | "recruit" | "notice" | "mypage" | "post";
}

export const PostingCrumbs = ({ title, board }: PostingCrumbsProps) => {
  const _board = PageName[board];

  return (
    <Breadcrumbs>
      <Link
        underline="none"
        color="inherit"
        href="/"
        sx={{ fontSize: "1rem" }}
      >
        Home
      </Link>
      <Link
        underline="none"
        color="inherit"
        href={`/${board}`}
        sx={{ fontSize: "1rem" }}
      >
        {_board}
      </Link>
    </Breadcrumbs>
  );
  }