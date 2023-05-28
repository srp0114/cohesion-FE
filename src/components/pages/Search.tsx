import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Grid, Typography, Stack, Divider } from "@mui/material";
import { Posting } from "../model/posting";
import { userInfo } from "../layout/postingDetail/userInfo";
import { BoardType } from "../model/board";
import Time from "../layout/Time";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SearchIcon  from "@mui/icons-material/Search";

const Search = () => {
  const [postings, setPostings] = useState<{ boardType: BoardType; data: Posting[] }[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("query");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .all([
        axios.get(`/api/free/list?search=${search}&page=0&size=4`),
        axios.get(`/api/questions/list?search=${search}&page=0&size=4`),
        axios.get(`/api/recruit/list?search=${search}&page=0&size=4`),
      ])
      .then(
        axios.spread((free, qna, recruit) => {         
          setPostings([
          { boardType: BoardType.free, data: free.data.data },
          { boardType: BoardType.question, data: qna.data.data },
          { boardType: BoardType.recruit, data: recruit.data.data },
          ]);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const goToPost = (boardType: BoardType, postId: number) => {
    navigate(`/${boardType}/${postId}`);
  };

  const goToBoard = (boardType: BoardType) => {
    navigate(`/${boardType}`);
  };

  const getBoardType = (boardType : BoardType) => {
    switch (boardType) {
      case BoardType.free:
        return "자유게시판";
      case BoardType.question:
        return "Q&A게시판";
      case BoardType.recruit:
        return "구인게시판";
      default:
        return "";
    }
  };

  return (
    <>
    <Grid container p={"3rem 5rem 0rem"} alignItems={"center"}>
      {postings.every((board) => board.data.length === 0) ? (
        <Stack direction={"row"} alignItems={"center"} pl={"3rem"}>
          <PriorityHighIcon sx={{fontSize: "1.9rem", color:"success.main"}}/>
          <Typography variant="h2" sx={{fontWeight: 500}}>{search}에 대한 내용이 없습니다</Typography>
        </Stack>
        ) : (
          <>
          <Stack direction={"row"} alignItems={"center"} pl={"3rem"}>
            <SearchIcon sx={{fontSize: "2rem", color:"success.main"}}/>
            <Typography variant="h2" sx={{fontWeight: 500}}>{search}에 대한 검색결과입니다</Typography>
          </Stack>
            {postings.map((board) => (
              <Grid item container direction={"column"} spacing={"1rem"} p={"4rem"}>
                <Grid item><Typography variant="h4" sx={{fontWeight: 600}}onClick={()=>{goToBoard(board.boardType)}}>
                {getBoardType(board.boardType)}</Typography>
                </Grid>
                <Grid item>
                <Divider sx={{color:"secondary.dark", borderBottomWidth: "0.7rem" }}/>
                </Grid>
                {board.data.length > 0 ? (
                  board.data.map((posting) => (
                    <Grid item container direction="row" alignItems={"center"} onClick={() => goToPost(board.boardType, posting.id)} ml={"2rem"}>
                      <Grid item xs><Typography variant="h4">{posting.title}</Typography></Grid>
                      <Grid item xs={4} md={4}>{userInfo(posting.writer, posting.stuId, posting.profileImg)}</Grid>
                      <Grid item xs={1} md={1}><Time date={posting.createdDate} variant="h5"/></Grid>
                    </Grid>
                    ))
                  ) : (
                    <Grid item ml={"2rem"}>
                    <Typography variant="h3" sx={{fontWeight: 500}}>{search}에 대한 내용이
                    {getBoardType(board.boardType)}에 없습니다.</Typography>
                    </Grid>
                  )
                }
              </Grid>
              ))
            }
          </>
        )
      }
    </Grid>
    </>
  )
}

export default Search;
