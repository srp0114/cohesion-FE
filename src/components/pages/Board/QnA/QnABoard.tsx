import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, Box, Grid, Stack } from "@mui/material";
import MostViewedPost from "../../../layout/MostViewedPost";
import Time from "../../../layout/Time";
import { skillData } from "../../../data/SkillData";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import { WritingButton } from "../../../layout/WritingButton";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";

// BoardItems 인터페이스
interface BoardItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  createdDate: string;
  modifiedDate?: string;
  language?: string;
  bookmark: number;
  reply: number;
  point: number;
}

// MostViewedItems 인터페이스
export interface MostViewedItems {
  id: number;
  title: string;
  writer: string;
  language?: string;
  point: number;
}

export const shortenContent = (str: string, length = 200) => {
  let content: string = "";
  if (str.length > length) {
    content = str.substring(0, length - 2);
    content = content + "...";
  } else {
    content = str;
  }
  return content;
};

const QnABaord: React.FC = () => {
  const [boardItems, setBoardItems] = useState<BoardItems[]>([]); // 인터페이스로 state 타입 지정
  const [mostViewedItems, setMostViewedItems] = useState<MostViewedItems[]>([]); // 인터페이스로 state 타입 지정
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    //목록 조회 부분
    const curPage = page - 1;
    axios({
      method: "get",
      url: "/api/qna/list?page=" + curPage + "&size=4",
    })
      .then((res) => {
        setBoardItems(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("로그인 x");
        } else if (err.response.status === 403) {
          console.log("권한 x");
        }
      });
    },[page]);

    useEffect(()=> {axios({
      method: "get",
      url: "/api/qna/most",
    })
      .then((res) => {
        if (res.status === 200) {
          setMostViewedItems(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //게시글 선택시 해당 게시물 상세보기로 페이지 이동
  const goToPost = (postId: number) => {
    navigate(`/questions/${postId}`);
  };

  return (
    <>
      {/* 조회수 높은 게시물 */}
      <MostViewedPost
        data={mostViewedItems} // mostViewedItems 를 props 로 전달
      />
      <Typography variant="h5" sx={{ marginTop: 8, marginBottom: 5 }}>
        Q&A 게시판
      </Typography>

      <Box>
        {boardItems?.map((value) => {
          // 선택한 언어에 따른 해당 언어의 로고 이미지 출력
          const Skill = value.language
            ? skillData.map((data) => {
              if (value.language === data.name) {
                return <img src={data.logo} width="25" height="25" />;
              }
            })
            : null;
          const regex = /<pre[^>]*>(.*?)<\/pre>/gs;
          const noPreTagContent = value.content.replace(regex, "");

          return (
            <>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  borderRadius: 2,
                  p: 2.5,
                  minWidth: 300,
                  marginTop: 2,
                  marginBottom: 4,
                  "&:hover": {
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
                onClick={() => goToPost(value.id)}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{
                      color: "text.primary",
                      fontSize: 22,
                      fontWeight: "medium",
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Typography sx={{ marginRight: 1 }}>
                      <Time date={value.createdDate} />
                    </Typography>
                    {Skill}
                  </Box>
                </Box>
                <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: shortenContent(noPreTagContent),
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 15,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ color: "text.secondary", display: "flex" }}>
                    <ProfileIcon sx={{ marginRight: 0.5 }} />
                    <Typography>{value.writer}</Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <BookmarkIcon />
                    <Typography>{value.bookmark}</Typography>
                    <ChatIcon sx={{ marginLeft: 1, marginRight: 0.5 }} />
                    <Typography>{value.reply}</Typography>
                  </Box>
                </Box>
              </Box>
            </>
          );
        })}
      </Box>
      <PaginationControl
            page={page}
            between={1}
            total={100}
            limit={4}
            changePage={(page: React.SetStateAction<number>) => setPage(page)}
            ellipsis={1}
          />
      <WritingButton />
    </>
  );
};

export default QnABaord;
