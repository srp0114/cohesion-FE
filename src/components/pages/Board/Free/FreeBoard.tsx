import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Time from "../../../layout/Time";
import { Avatar, Box, Typography, Grid, Stack } from "@mui/material";
import FilterPosting from "../../../layout/FilterPosting";
import axios from "axios";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { WritingButton } from "../../../layout/WritingButton";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { shortenContent } from "../QnA/QnABoard";


//자유게시판 페이지 인터페이스
export interface FreeBoardItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  stuId: number; //타입 string에서 number로 알맞게 변경.
  profileImg: string; //사용자 프로필 사진 img 링크. 현재는 <Avartar />의 기본 이미지가 들어감
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  //imgUrl?: Array<string>; //이미지
}
const FreeBoard = () => {
  const [freeData, setFreeData] = useState<FreeBoardItems[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
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
  }, []);

  const displayPosting = freeData.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  }

  );

  return (
    <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
      <Typography
        variant="h5" >
        자유게시판
      </Typography>
      <FilterPosting />
      {displayPosting}
      <PaginationControl
        page={page}
        between={1}
        total={100}
        limit={20}
        changePage={(page: React.SetStateAction<number>) => setPage(page)}
        ellipsis={1}
      />
      <WritingButton />
    </Box>
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

    <Grid container direction="column" item xs={12} rowSpacing="1rem" sx={{
      bgcolor: "background.paper",
      borderRadius: "50px",
      border: "0.5px solid black",
      "&:hover": {
        boxShadow: 5,
        pointer:"cursor"
      },
      margin: "2.25rem 0",
      padding: "0.75rem 2rem 1.25rem",
      height:"16rem", //게시글 박스 높이
      justifyContent:"space-between",
      alignItems:"stretch"
    }}
      onClick={() => goToPost(props.id)}>
      <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h5" >
          {props.title}
        </Typography>
        <Time date={props.createdDate} variant="h6"/>
      </Grid>

      <Grid item sx={{
      whiteSpace: "pre-line",
      wordWrap: "break-word",
      overflow: "hidden",
      textOverflow: "ellipsis",
      alignItems: "stretch",
      }}>
        <Typography variant="body1">
          <div
            dangerouslySetInnerHTML={{
              __html: shortenContent(props.content,50),
            }}
          />
        </Typography>

        {/*최대 n자까지만 나타나도록 수정요함. */}
        {/* 이미지에 대해서는 추후 논의 후 추가)*/}
      </Grid>

      <Grid item>
        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
          {userInfo(props.writer, props.profileImg, props.stuId)}
          {reply_bookmark_views(props)} {/*북마크 onClick 추가 필요*/}
        </Box>
      </Grid>
    </Grid>
  );
};

export default FreeBoard;


