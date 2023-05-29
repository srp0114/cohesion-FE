import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Grid, Stack, Box, Typography, Link } from "@mui/material";
import Time from "../../../layout/Time";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { BoardSkeleton, useSkeleton } from "../../../layout/Skeletons";
import SearchBoardField from "../../../layout/SearchBoardField";
import SortBoard from "../../../layout/SortBoard";
import Shorten from "../../../layout/Shorten";

export interface NoticeItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; 
  profileImg: string | null; 
  stuId: number;
  image: {imageUrl: string}[];
}

const testData : NoticeItems[] = [
  {
    id: 1,
    title: "title",
    content: "content",
    writer: "admin",
    createdDate: "now",
    bookmark: 2,
    reply: 0,
    views: 1,
    profileImg: null,
    stuId: 120,
    image: []
  }, 
  {
    id: 2,
    title: "tiddtle",
    content: "contddddddent",
    writer: "admiddddn",
    createdDate: "now",
    bookmark: 2,
    reply: 0,
    views: 1,
    profileImg: null,
    stuId: 13120,
    image: []
  }
]

const Notice = () => {
  const [boardItems, setBoardItems] = useState<NoticeItems[]>(testData);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams(); 
  const currentPage = searchParams.get('page');
  const [page, setPage] = useState<number>(currentPage ? parseInt(currentPage) : 1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>("createdAt,desc");

  const getBoardItems = (sort: string, search?: string) => {
    const curPage = page - 1;
    const params = { size: 5, sort: sort };
    let url = `/api/notice/list?page=${curPage}`;

    if(search !== undefined) {
      url += `&search=${search}`;
    }
        
    setSearchParams({page: page.toString()})
    axios({
      method: "get",
      url: url,
      params: params
    })
    .then((res) => {
      if (res.status === 200) {
        setBoardItems(res.data.data);
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

  useEffect(() => {
    getBoardItems(sort, search);
  }, [page, search, sort]);

  const arrangeBoard = (changeSort:string, changeSearch?: string | undefined) => {
    setSearch(changeSearch);
    setSort(changeSort);
    getBoardItems(sort, search);
  };

  const loadingStatus:boolean = useSkeleton(800, boardItems);

  const displayPosting = boardItems.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  });

  return (
    <>
      {loadingStatus ? (
      <Stack direction={"column"} spacing={"2.5rem"} sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <Stack direction={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"1rem"} pl={3}>
          <Typography variant="h2" className="boardTitle" onClick={() => {arrangeBoard("createdAt,desc", undefined)}}>공지사항</Typography>
          <SortBoard sort={sort} setSort={setSort} arrange={(sort) => arrangeBoard(sort, search)}/>
          </Stack>
          {boardItems.length === 0 && search !== undefined ? 
            <Stack p={"0rem 2rem 0rem"}>
              <Typography variant="h3" sx={{ color: "secondary.dark", fontWeight: 600 }}>일치하는 검색결과가 없습니다.</Typography>
            </Stack> : displayPosting
          }
          <Box display={"flex"} justifyContent={"flex-end"}>
          <SearchBoardField search={search} setSearch={setSearch} arrange={(search) => arrangeBoard(sort, search)}/>
          </Box>
          <PaginationControl
            page={page}
            between={1}
            total={total}
            limit={5}
            changePage={(page: React.SetStateAction<number>) => setPage(page)}
            ellipsis={1}
          />
        </Stack>)
        : (
          <BoardSkeleton />
          )}
    </>
  );

}

const PreviewPosting: React.FunctionComponent<NoticeItems> = (props: NoticeItems) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/notice/${postId}`);
  };

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
      <Grid item container direction={"column"} sx={{p:"0.5rem"}} spacing={"1rem"}>
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
          <Typography variant="h3">{props.title}</Typography>
        </Stack>
        <Stack direction="row" spacing={"1rem"}>
          <Time date={props.createdDate} variant="h5" />
        </Stack>
        </Grid>
        <Grid item className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(props.content, 200)}}/>
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
      <Grid item container direction="column" xs={8} md={8} spacing={"1.2rem"}>
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h3">{props.title}</Typography>
          </Stack>
          <Time date={props.createdDate} variant="h5" />
        </Grid>
        <Grid item sx={{width: "100%"}} className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(props.content, 200) }}/>
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

export default Notice;
