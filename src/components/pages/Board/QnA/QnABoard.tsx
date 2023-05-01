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
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { BoardSkeleton } from "../../../layout/Skeletons";
// BoardItems 인터페이스
export interface BoardItems {
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

  //이하 추가되어야함.
  views: number; //조회수
  profileImg: string; //사용자 이미지 img
  stuId: number; //사용자 아이디, 학번
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

const QnABaord = () => {
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
  }, [page]);

  useEffect(() => {
    axios({
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

  const displayPosting = boardItems.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  });

  return (
    <>
      <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
        <Typography
          variant="h5" >
          Q&A게시판
        </Typography>

        {/* 조회수 높은 게시물 */}
        <MostViewedPost
          data={mostViewedItems} // mostViewedItems 를 props 로 전달
        />

        {displayPosting}
        <PaginationControl
          page={page}
          between={1}
          total={100}
          limit={20}
          changePage={(page: React.SetStateAction<number>) => setPage(page)}
          ellipsis={1}
        /><WritingButton /></Box>
    </>
  );

}

const PreviewPosting: React.FunctionComponent<BoardItems> = (
  props: BoardItems
) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/questions/${postId}`);
  };

  // 선택한 언어에 따른 해당 언어의 로고 이미지 출력
  const Skill = props.language
    ? skillData.map((data) => {
      if (props.language === data.name) {
        return <img src={data.logo} width="25" height="25" />;
      }
    })
    : null;
  const regex = /<pre[^>]*>(.*?)<\/pre>/gs;
  const noPreTagContent = props.content.replace(regex, "");

  return (

    <Grid container direction="column" item xs={12} rowSpacing="1rem" sx={{
      bgcolor: "background.paper",
      borderRadius: "50px",
      border: "0.5px solid black",
      "&:hover": {
        boxShadow: 5,
        pointer: "cursor"
      },
      margin: "2.25rem 0",
      padding: "0.75rem 2rem 1.25rem",
      height: "16rem", //게시글 박스 높이
      justifyContent: "space-between",
      alignItems: "stretch"
    }}
      onClick={() => goToPost(props.id)}>
      <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" >
          {props.title} {Skill}
        </Typography>

        <Time date={props.createdDate} variant="h6" />
      </Grid>

      <Grid item sx={{
        whiteSpace: "pre-line",
        wordWrap: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis",
        alignItems: "stretch",
        maxHeight: "6.5rem"
      }}>
        <Typography variant="body1">
          <div
            dangerouslySetInnerHTML={{
              __html: shortenContent(noPreTagContent, 50)
            }}
          />
        </Typography>
        {/* 이미지에 대해서는 추후 논의 후 추가)*/}
      </Grid>

      <Grid item>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {userInfo(props.writer, props.profileImg, props.stuId)}
          {reply_bookmark_views(props)}
        </Box>
      </Grid>
    </Grid>
  );
}


export default QnABaord;