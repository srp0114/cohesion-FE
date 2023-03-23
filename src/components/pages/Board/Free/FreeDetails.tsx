import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../layout/Header";
import Time from "../../../layout/Time";
import {
  Avatar,
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Reply } from "../../../model/reply";
import axios from "axios";

//자유 상세보기 인터페이스
interface FreeDetailItems {
  id: number;
  title: string;
  content: string;
  //imgUrl?: Array<string>;
  writer: string;
  profileImg: string;
  //stuId: number; 사용자 학번
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  replies?: Array<Reply> | undefined;
  views: number; //조회수
}

const FreeDetails: React.FC = (): JSX.Element => {
  const [postItem, setPostItem] = useState<FreeDetailItems | undefined>();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/freeBoards/${id}`)
      .then((res) => setPostItem(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const detailPosting = postItem ? (
    <>
      <Box sx={{ paddingLeft: 3, paddingRight: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 1, fontWeight: 600 }}>
            {postItem.title}
          </Typography>
          <Typography variant="caption">
            <Time date={postItem.createdDate} />
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 5 }}>
          <Stack direction="row">
            <Avatar
              srcSet={postItem.profileImg as string}
              sx={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <Typography variant="body2">
              {`${postItem.writer} (사용자 학번)`}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ marginBottom: 1 }}>
          <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
          {/* 이미지에 대해서는 추후 논의 후 추가)*/}
        </Box>
        <Box sx={{ marginTop: 3, marginBottom: 3 }}>
          <Stack direction="row" sx={{ disply: "flex", justifyContent: "end" }}>
            <IconButton size="small">
              <Person2OutlinedIcon /> {postItem.views}
            </IconButton>
            <IconButton size="small">
              <BookmarkIcon /> {postItem.bookmark}
            </IconButton>
          </Stack>
        </Box>

        <Box>
          <Typography
            variant="body1"
            sx={{ marginBottom: 5, paddingLeft: 3, fontWeight: 600 }}
          >
            {`${postItem.reply}개의 댓글이 있습니다.`}
          </Typography>
          <Box sx={{ border: "1px solid #787878", height: "50%" }}>
            {/*은서: 추후 이곳에 댓글 목록, 댓글 작성란 등 컴포넌트 추가하기*/}
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <Typography>no data</Typography>
  );

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
          {detailPosting}
        </Box>
      </Container>
    </>
  );
};

export default FreeDetails;
