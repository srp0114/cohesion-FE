import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Time from "../../../layout/Time";
import { Box, Typography, Grid, Stack } from "@mui/material";
import axios from "axios";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { BoardSkeleton, useSkeleton } from "../../../layout/Skeletons";
import SearchBoardField from "../../../layout/SearchBoardField";
import SortBoard from "../../../layout/SortBoard";
import Shorten from "../../../layout/Shorten";

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
  image: {imageUrl: string}[];
}

const FreeBoard = () => {
  const [freeData, setFreeData] = useState<FreeBoardItems[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('page');
  const [page, setPage] = useState<number>(currentPage ? parseInt(currentPage) : 1);

  const getBoardItems = (sort:string) => {
    const curPage = page - 1;
    const params = { size: 5, sort: sort };

    setSearchParams({page: page.toString()})
    axios({
      method: "get",
      url: `/api/free/list?page=${curPage}`,
      params: params
    })
    .then((res) => {
      if (res.status === 200) {
        setFreeData(res.data.data);
        setTotal(res.data.count);
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        console.log("로그인 x");
      } else if (err.response.status === 403) {
        console.log("권한 x");
      }
    });
  }

  const loadingStatus: boolean =  useSkeleton(800, freeData);

  useEffect(() => {
    getBoardItems("createdAt,desc");
  }, [page]);

  const performSearch = (search : string) => {
    axios({
      method: "get",
      url: `/api/free/list?search=${search}&page=0&size=4`,
    })
      .then((res) => {
        if (res.status === 200) {
          setFreeData(res.data.data);
          setTotal(res.data.count);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

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
        loadingStatus ? (
          <Stack direction={"column"} spacing={"2.5rem"} sx={{ padding: "2.25rem 10rem 4.5rem" }}>
            <Stack direction={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"1rem"} pl={3}>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>자유게시판</Typography>
              <SortBoard setBoardSort={getBoardItems}/>
            </Stack>
            {freeData.length === 0 ? 
              <Stack p={"0rem 2rem 0rem"}>
                <Typography variant="h3" sx={{ color: "secondary.dark", fontWeight: 600 }}>일치하는 검색결과가 없습니다.</Typography>
              </Stack> : displayPosting
            }
            <Box display={"flex"} justifyContent={"flex-end"}>
              <SearchBoardField setSearchAPI={performSearch}/>
            </Box>
            <PaginationControl
              page={page}
              between={1}
              total={total}
              limit={5}
              changePage={(page: React.SetStateAction<number>) => setPage(page)}
              ellipsis={1}
            />
            <WritingButton />
          </Stack>
        )
        : (
          <BoardSkeleton />
        )
      }
      <WritingButton />
  </>);

}

const PreviewPosting: React.FunctionComponent<FreeBoardItems> = (
  props: FreeBoardItems
) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/free/${postId}`);
  };

  const preRegex = /<pre[^>]*>(.*?)<\/pre>/gs;
  const imgRegex = /<img\b[^>]*>/gs;
  const noPreTag = props.content.replace(preRegex, "");
  const deleteTag = noPreTag.replace(imgRegex, "");


  return (
    <Grid container direction="column" item xs={12} sx={{
      bgcolor: "background.paper",
      borderRadius: "40px",
      boxShadow: 3,
      margin: "2.25rem 0",
      padding: "2rem 2.5rem 2rem",
      justifyContent: "space-between",
      height: "15rem",
      "&:hover": {
        boxShadow: 5,
        pointer: "cursor"
      }
    }} onClick={() => goToPost(props.id)}>
    {props.image.length === 0 ? (
      <Grid item container direction={"column"} p={"0.5rem"} spacing={"1rem"}>
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
          <Typography variant="h3">{props.title}</Typography>
        </Stack>
        <Time date={props.createdDate} variant="h5" />
        </Grid>
        <Grid item className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(deleteTag, 200)}}/>
        </Grid>
        <Grid item>
          <Stack direction={"row"} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {userInfo(props.writer, props.stuId, props.profileImg)}
            {reply_bookmark_views(props)}
          </Stack>
        </Grid>
      </Grid>
    ) : (
    <Grid item container spacing={4} > 
      <Grid item xs={4} md={4} sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box position="relative" width="22rem" height="11rem">
          <span style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, 
            backgroundSize: 'cover', backgroundImage: `url(${props.image[0].imageUrl})` }} />
        </Box>
      </Grid>
      <Grid item container direction="column" xs={8} md={8} p={"0.5rem"} spacing={"1.2rem"}>
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h3">{props.title}</Typography>
          </Stack>
          <Time date={props.createdDate} variant="h5" />
        </Grid>
        <Grid item sx={{width: "100%"}} className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(deleteTag, 200) }}/>
        </Grid>
        <Grid item>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {userInfo(props.writer, props.stuId, props.profileImg)}
            {reply_bookmark_views(props)}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )}
  </Grid>
  );
}

export default FreeBoard;