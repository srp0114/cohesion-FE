import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Time from "../../../layout/Time";
import { Box, Chip, Typography, Grid, Stack } from "@mui/material";
import axios from "axios";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { shortenContent } from "../QnA/QnABoard";
import { BoardSkeleton } from "../../../layout/Skeletons";

//자유게시판 페이지 인터페이스
export interface FreeBoardItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  stuId: number;
  profileImg: string | null;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number;
  //imgUrl?: Array<string>; //이미지
}
const FreeBoard = () => {
  const [freeData, setFreeData] = useState<FreeBoardItems[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); //loading이 false면 skeleton, true면 게시물 목록 
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/free/total"
    })
      .then((res) => {
        if (res.status === 200) {
          setTotal(res.data);
        }
      })
  }, [])

  useEffect(() => {
    setLoading(false); //마운트될 때, api 요청 보내기 전 skeleton
    const curPage = page - 1;
    axios({
      method: "get",
      url: "/api/free/list?page=" + curPage + "&size=4",
    })
      .then((res) => {
        if (res.status === 200) {
          setFreeData(res.data);
        }
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
    setLoading(true); //freeData 상태가 변할 때 게시글 목록
  }, [freeData]);

  const displayPosting = freeData.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  }

  );

  return (<>
    {
      loading ? (
        <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <Typography
            variant="h5" >
            자유게시판
          </Typography>

          {displayPosting}
          <PaginationControl
            page={page}
            between={1}
            total={total}
            limit={4}
            changePage={(page: React.SetStateAction<number>) => setPage(page)}
            ellipsis={1}
          /><WritingButton /></Box>
      )
        : (<Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <BoardSkeleton />
          <WritingButton />
        </Box>)
    }
  </>);

}

const PreviewPosting: React.FunctionComponent<FreeBoardItems> = (
  props: FreeBoardItems
) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/free/${postId}`);
  };

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
        <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
          <Typography variant="h5">{props.title}</Typography>
          {(typeof props.modifiedDate === 'object') ?
            null : <Chip label="modified" size="small" variant="outlined" color="error" />}
        </Stack>

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
              __html: shortenContent(props.content, 50),
            }}
          />
        </Typography>
        {/* 이미지에 대해서는 추후 논의 후 추가)*/}
      </Grid>

      <Grid item>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {userInfo(props.writer, props.stuId, props.profileImg)}
          {reply_bookmark_views(props)} {/*북마크 onClick 추가 필요*/}
        </Box>
      </Grid>
    </Grid >
  );
};

export default FreeBoard;


