import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, Link, Grid, Stack } from "@mui/material";
import Time from "../../../layout/Time";
import { skillData } from "../../../data/SkillData";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { BoardSkeleton } from "../../../layout/Skeletons";
import SearchBoardField from "../../../layout/SearchBoardField";
import SortBoard from "../../../layout/SortBoard";
import Shorten from "../../../layout/Shorten";

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
  views: number; 
  profileImg: string | null; 
  stuId: number;
  image: {imageUrl: string}[];
}

const QnABoard = () => {
  const [boardItems, setBoardItems] = useState<BoardItems[]>([]); // 인터페이스로 state 타입 지정
  const [loading, setLoading] = useState(false); //loading이 false면 skeleton, true면 게시물 목록 
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('page');
  const [page, setPage] = useState<number>(currentPage ? parseInt(currentPage) : 1);

  const navigate = useNavigate();
  const goToBoard = () => {
    navigate("questions");
    setSearchParams({page: "1"});
    getBoardItems("createdAt,desc");
  };

  const getBoardItems = (sort:string) => {
    const curPage = page - 1;
    const params = { size: 5, sort: sort };

    setSearchParams({page: page.toString()})
    axios({
      method: "get",
      url: `/api/questions/list?page=${curPage}`,
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


  /* 1.5초간 스켈레톤 표시 */
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [boardItems]);

  useEffect(() => {
    getBoardItems("createdAt,desc");
  }, [page]);

  const performSearch = (search : string) => {
    axios({
      method: "get",
      url: `/api/questions/list?search=${search}&page=0&size=5`,
    })
      .then((res) => {
        if (res.status === 200) {
          setBoardItems(res.data.data);
          setTotal(res.data.count);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const displayPosting = boardItems.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  });

  return (
    <>
      {loading ? (
      <Stack direction={"column"} spacing={"2.5rem"} sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <Stack direction={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"1rem"} pl={3}>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>Q&A게시판</Typography>
            <SortBoard setBoardSort={getBoardItems}/>
          </Stack>
          {displayPosting}
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
        </Stack>)
        : (<Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <BoardSkeleton />
          <WritingButton />
        </Box>)}
    </>
  );

}

const PreviewPosting: React.FunctionComponent<BoardItems> = (props: BoardItems) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/questions/${postId}`);
  };

  const SkillIcon = props.language
    ? skillData.map((data) => {
      if (props.language === data.name) {
        return <img src={data.logo} width="25" height="25" />;
      }
    })
    : null;

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
      <Grid item container direction={"column"} sx={{p:"0.5rem"}} spacing={"1rem"}>
        <Grid item display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h3">{props.title}</Typography>
        <Stack direction="row" spacing={"1rem"}>
          <Time date={props.createdDate} variant="h5" />
          {SkillIcon}
        </Stack>
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
      <Grid item container direction="column" p={"0.5rem"} xs={8} md={8} spacing={"1.2rem"}>
        <Grid item display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="h3">{props.title}</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <Time date={props.createdDate} variant="h5" />
            {SkillIcon}
          </Stack>
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

export default QnABoard;