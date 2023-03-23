import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../layout/Header";
import Time from "../../../layout/Time";
import {
  Avatar,
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Board } from "../../../model/board";
import { Posting } from "../../../model/posting";
import FilterPosting from "../../../layout/FilterPosting";
import axios from "axios";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";

//자유게시판 페이지 인터페이스
interface FreeBoardItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string; //사용자 프로필 사진 img 링크. 현재는 <Avartar />의 기본 이미지가 들어감
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  //stuId: number; //사용자 학번
  //imgUrl?: Array<string>; //이미지
}
//은서: FreeBoardListDTO 보면서 만들긴했는데 작성자 닉네임, 프로필이미지, 달린 댓글 수가 없어서 추가부탁드려요!
const FreeBoard = () => {
  const [freeData, setFreeData] = useState<FreeBoardItems[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const curPage = page - 1;
    axios
      .get("/api/freeBoardsPage?page=" + curPage + "&size=4")
      .then((response) => setFreeData(response.data))
      .catch((error) => console.log(error));
  }, [page]);

  const displayPosting = freeData.map((element, idx) => (
    <PreviewPosting {...element} key={idx} />
  ));

  return (
    <>
      <Container>
        <Header />
        <Box
          sx={{
            borderLeft: "1px solid black",
            borderRight: "1px solid black",
            padding: 10,
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: 5, paddingLeft: 3, fontWeight: 600 }}
          >
            자유게시판
          </Typography>
          <FilterPosting />
          {displayPosting}
        </Box>
        <p></p>
        <PaginationControl
          page={page}
          between={1}
          total={100}
          limit={20}
          changePage={(page: React.SetStateAction<number>) => setPage(page)}
          ellipsis={1}
        />
      </Container>
    </>
  );
};

const PreviewPosting: React.FunctionComponent<FreeBoardItems> = (
  props: FreeBoardItems
) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/free/${postId}`);
  };

  return (
    <Box
      sx={{
        minWidth: 275,
        marginBottom: "3%",
        border: "2px solid #787878",
        borderRadius: 10,
        padding: 3,
      }}
    >
      <Box
        sx={{
          marginBottom: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" onClick={() => goToPost(props.id)}>
          {props.title}
        </Typography>
        <Typography variant="caption">
          <Time date={props.createdDate} />
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" onClick={() => goToPost(props.id)}>
          {props.content}
        </Typography>
        {/*최대 n자까지만 나타나도록 수정요함. */}
        {/* 이미지에 대해서는 추후 논의 후 추가)*/}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row">
          <Avatar
            srcSet={props.profileImg as string}
            sx={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          <Typography variant="overline">
            {`${props.writer} (사용자 학번)`}
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconButton size="small">
            <Person2OutlinedIcon /> {props.views}
          </IconButton>
          <IconButton size="small">
            <BookmarkIcon /> {props.bookmark}
          </IconButton>
          <IconButton size="small">
            <ChatIcon /> {props.reply}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default FreeBoard;
