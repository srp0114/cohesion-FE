import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Time from "../../../layout/Time";
import { Avatar, Box, Stack, Typography, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import axios from "axios";
import Reply from "../../../layout/Reply/Reply";

//자유 상세보기 인터페이스
interface FreeDetailItems {
  id: number;
  title: string;
  content: string;
  //imgUrl?: Array<string>;
  writer: string;
  profileImg: string;
  stuId: number;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
}

const FreeDetails = (): JSX.Element => {
  const [postItem, setPostItem] = useState<FreeDetailItems | undefined>();
  const { id } = useParams() as { id: string };
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [bookmarkCheck, setBookmarkCheck] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/freeBoards/" + id,
    })
      .then((res) => {
        setPostItem(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("로그인 x");
        } else if (err.response.status === 403) {
          console.log("권한 x");
        }
      });
    //해당 게시글의 북마크 수
    axios({
      method: "get",
      url: "/api/free-boards/" + id + "/bookmark-count",
    })
      .then((res) => {
        setBookmarkCount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //접속 유저가 해당 게시글의 북마크를 설정하였는지 아닌지 체크
    axios({
      method: "get",
      url: "/api/free-boards/" + id + "/bookmark-check",
    })
      .then((res) => {
        setBookmarkCheck(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //북마크 등록
  const onClickBookmark = () => {
    if (bookmarkCheck === false) {
      axios({
        method: "post",
        url: "/api/free-boards/" + id + "/bookmark",
      })
        .then((res) => {
          if (res.status === 200) {
            alert("해당 게시글을 북마크로 등록하였습니다.");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios({
        method: "delete",
        url: "/api/free-boards/" + id + "/bookmark",
      })
        .then((res) => {
          alert("북마크를 취소하였습니다.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
              {`${postItem.writer} (${postItem.stuId})`}
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
            <IconButton size="small" onClick={onClickBookmark}>
              <BookmarkIcon /> {bookmarkCount}
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
          <Reply postingID={id} />
        </Box>
      </Box>
    </>
  ) : (
    <Typography>no data</Typography>
  );

  return (
    <>
      <Box
        sx={{
          borderLeft: "1px solid black",
          borderRight: "1px solid black",
          padding: 10,
        }}
      >
        {detailPosting}
      </Box>
    </>
  );
};

export default FreeDetails;
