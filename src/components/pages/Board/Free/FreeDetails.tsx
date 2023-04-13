import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Time from "../../../layout/Time";
import {
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Visibility from "@mui/icons-material/VisibilityOutlined";
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

const FreeDetails = () => {
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
      <Grid container direction="column" rowSpacing={"8rem"}>
        <Grid item container xs={12} direction="column">
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {postItem.title}
            </Typography>
          </Grid>

          <Grid item container xs={12} justifyContent={"space-between"}>
            <Grid item xs={4}>
              <Stack
                direction="row"
                sx={{ display: "flex", justifyContent: "start" }}
              >
                <Avatar
                  srcSet={postItem.profileImg}
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    marginRight: "0.75rem",
                  }}
                />
                <Typography variant="h6">
                  {`${postItem.writer} (${postItem.stuId})`}
                </Typography>
              </Stack>
            </Grid>

            <Grid item justifyContent={"flex-end"}>
              <Time date={postItem.createdDate} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ padding: "0 2.5rem" }}>
          <Typography variant="h5">
            <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
            {/* 이미지에 대해서는 추후 논의 후 추가)*/}
          </Typography>
        </Grid>

        <Grid item container xs={12} justifyContent={"space-between"}>
          <Grid item xs={3}>
            <Typography variant="h5">{`${postItem.reply}개의 댓글이 있습니다.`}</Typography>
          </Grid>

          <Grid item justifyContent={"flex-end"}>
            <Stack direction="row" spacing={"0.75rem"}>
              <Box>
                <IconButton size="small" disabled>
                  <Visibility fontSize="large" />
                  <Typography variant="h6">{postItem.views}</Typography>
                </IconButton>
              </Box>

              <Box>
                <IconButton size="small" onClick={onClickBookmark}>
                  <BookmarkIcon fontSize="large" />
                  <Typography variant="h6">{bookmarkCount}</Typography>
                </IconButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      <Reply postingID={id} />
    </>
  ) : (
    <Typography>no data</Typography>
  );

  return <Box sx={{margin:'2.25rem'}}>{detailPosting}</Box>;
};

export default FreeDetails;
