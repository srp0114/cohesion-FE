import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Grid, Typography, Stack, Divider } from "@mui/material";
import { Posting } from "../model/posting";
import { userInfo } from "../layout/postingDetail/userInfo";
import { BoardType } from "../model/board";
import Time from "../layout/Time";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

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
          { boardType: BoardType.free, data: free.data },
          { boardType: BoardType.question, data: qna.data },
          { boardType: BoardType.recruit, data: recruit.data },
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

  return (
    <>
      {postings.every((board) => board.data.length === 0) ? (
          <Grid container p={"2rem 4rem 2rem"} alignItems={"center"}>
            <PriorityHighIcon sx={{fontSize: "2rem", color:"success.main"}}/>
            <Typography variant="h2">{search}에 대한 내용이 없습니다.</Typography>
          </Grid>
        ) : (
          postings.map((board) => (
          <Grid container direction="column" spacing={"1.5rem"} p={"2rem 5rem 3rem"} key={board.boardType}>
            <Grid item>
              <Typography variant="h1" onClick={()=>{goToBoard(board.boardType)}}>
                {board.boardType === BoardType.free && "자유게시판"}
                {board.boardType === BoardType.question && "Q&A게시판"}
                {board.boardType === BoardType.recruit && "구인게시판"}
              </Typography>
            </Grid>
            <Grid item>
              <Divider sx={{color:"secondary.dark", borderBottomWidth: "0.7rem" }}/>
            </Grid>
            {board.data.length > 0 ? (
              board.data.map((posting) => (
                <>
                  <Grid item container direction="column" spacing={"1.5rem"} p={"2rem 4rem 2rem"} 
                    onClick={() => goToPost(board.boardType, posting.id)}>
                    <Grid item>
                      <Stack direction="row" alignItems={"center"} gap={"2rem"}>
                        <Typography variant="h2">{posting.title}</Typography>
                        <Time date={posting.createdDate} variant="h5" />
                      </Stack>
                    </Grid>
                    <Grid item>
                      {userInfo(posting.writer, posting.stuId, posting.profileImg)}
                    </Grid>
                  </Grid>
                </>
              ))
            ) : (
              <Grid item ml={"2rem"}>
                <Typography variant="h3">{search}에 대한 내용이
                {board.boardType === BoardType.free && " 자유게시판"}
                {board.boardType === BoardType.question && " Q&A게시판"}
                {board.boardType === BoardType.recruit && " 구인게시판"}에 없습니다.</Typography>
              </Grid>
            )}
            </Grid>
        ))
        )
      }
    </>
  );
};

export default Search;
