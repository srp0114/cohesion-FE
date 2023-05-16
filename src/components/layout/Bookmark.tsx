import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stack, Typography, Button, Snackbar, SnackbarOrigin, Alert } from "@mui/material";
import BorderBookmark from "@mui/icons-material/BookmarkBorder";
import FilledBookmark from '@mui/icons-material/Bookmark';

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface BookmarkProps {
  boardType: string
  id: string
}

const Bookmark = (props: BookmarkProps) => {
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [bookmarkCheck, isBookmarked] = useState<boolean>(false);
  const [bookmark, setBookmark] = useState<boolean>(false);
  const board = props.boardType;
  const id = props.id; 
  
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;
  const [message, setMessage] = useState<string>("");


  // 기존 상세보기의 북마크 api get, post, delete - 분리
  // boardType, 게시글 번호를 상세보기로부터 받아와 api 주소 설정
  useEffect(() => {
    //해당 게시글의 북마크 수
    axios({
      method: "get",
      url: `/api/${board}/${id}/bookmark-count`,
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
      url: `/api/${board}/${id}/bookmark-check`,
    })
    .then((res) => {
      isBookmarked(res.data);
      setBookmark(bookmarkCheck);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [id, board, bookmarkCheck])

  //북마크 등록
  const onClickBookmark = () => {
      bookmark ? 
      axios({
        method: "post",
        url: `/api/${board}/${id}/bookmark`,
      })
      .then((res) => {
        if (res.status === 200) { 
          isBookmarked(true);
          setBookmarkCount((prev) => (prev + 1));
          setMessage("해당 게시글을 북마크로 등록하였습니다.");
          setState({ ...state, open: true });  
        }
      })
      .catch((err) => {
        console.log(err);
      }) :
      axios({
        method: "delete",
        url: `/api/${board}/${id}/bookmark`,
      })
      .then((res) => {
        isBookmarked(false);
        setBookmarkCount((prev) => (prev - 1));
        setMessage("해당 게시글 북마크를 취소하였습니다.");
        setState({ ...state, open: true });  
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMouseOver = () => {
    bookmarkCheck ? setBookmark(false) : setBookmark(true);
  }

  const handleMouseOut = () => {
    setBookmark(bookmarkCheck);
  }

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
    <Stack sx={{ justifyContent: "end", alignItems:"center" }}>
      <Button className="bookmark" onClick={onClickBookmark} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {bookmark ? <FilledBookmark sx={{fontSize: "2rem"}} /> : <BorderBookmark sx={{fontSize:  "2rem"}}/>}
      </Button>
    </Stack>
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={2000}
      open={open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
    </>
  );
}

export default Bookmark;
