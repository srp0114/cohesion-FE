import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stack, Typography, Button } from "@mui/material";
import BorderBookmark from "@mui/icons-material/BookmarkBorder";
import FilledBookmark from '@mui/icons-material/Bookmark';

interface BookmarkProps {
  boardType: string
  id: string
}

const Bookmark = (props: BookmarkProps) => {
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [bookmarkCheck, isBookmarked] = useState<boolean>(false);
  const [bookmark, setBookmark] = useState<boolean>(bookmarkCheck);

  const board = props.boardType;
  const id = props.id; 

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
    })
    .catch((err) => {
      console.log(err);
    });
  }, [bookmarkCheck, bookmarkCount])

  //북마크 등록
  const onClickBookmark = () => {
      bookmark ? 
      axios({
        method: "post",
        url: `/api/${board}/${id}/bookmark`,
      })
      .then((res) => {
        if (res.status === 200) {
          alert("해당 게시글을 북마크로 등록하였습니다.");
          isBookmarked(true);
          setBookmarkCount((prev) => (prev + 1));
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
        alert("북마크를 취소하였습니다.");
        isBookmarked(false);
        setBookmarkCount((prev) => (prev - 1));
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

  return (
    <Stack direction="row">
      <Button className="bookmark" onClick={onClickBookmark} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {bookmark ? <FilledBookmark /> : <BorderBookmark />}
      </Button>
      <Typography variant="subtitle2">{bookmarkCount}</Typography>
    </Stack>
  );
}

export default Bookmark;