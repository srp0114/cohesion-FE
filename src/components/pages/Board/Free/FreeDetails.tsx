import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Chip, Grid, Typography, Zoom, Stack } from "@mui/material";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { PostingSkeleton } from "../../../layout/Skeletons";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import Bookmark from "../../../layout/Bookmark";
import TimeAndViews from "../../../layout/postingDetail/TimeAndViews";
import Reply from "../../../layout/Reply/Reply";
import File from "../../../layout/File";

interface FreeDetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string | null;
  stuId: number;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
}

export interface FileItem {
  originalName: string;
}

const FreeDetails = () => {
  const [postItem, setPostItem] = useState<FreeDetailItems | undefined>();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(false); //loading이 false면 skeleton, true면 게시물 목록 
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const [isFile, setIsFile] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);

  const postingId = Number(id);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/free/detail/" + id,
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
    getCurrentUserInfo()
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));

    axios({
      method: "get",
      url: `/api/free/${id}/file-list`
    })
      .then((res) => {
        setFileList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /* 1.5초간 스켈레톤 표시 */
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /**
  * 글 작성자에게 게시글 수정, 삭제 버튼을 보여줌.
  * @param studentId 
  * @param title 
  * @param content 
  * @returns 게시글 정보를 포함하고있는 speedDial
  */
  const displayUpdateSpeedDial = (studentId: number, title: string, content: string) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) {
        return (<UpdateSpeedDial boardType={BoardType.free} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

  const PostDetails = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"1.5rem"} mb={"1rem"}>
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="free" />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h1" sx={{fontWeight:"600"}}>{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="수정됨" size="small" variant="outlined" color="error" />}
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
          >
            {userInfo(postItem.writer, postItem.stuId, postItem.profileImg)}
            {TimeAndViews(postItem.createdDate, postItem.views)}
          </Stack>
          <Bookmark boardType={"free"} id={id} />
        </Grid>
        {fileList.length > 0 && 
        <Grid item xs={12}>
          <File fileList={fileList} />
        </Grid>
        }
        <Grid item xs={12} sx={{ m: "3rem 0rem 5rem" }}>
          <div className="ql-snow">
            <div className="ql-editor"
              dangerouslySetInnerHTML={{ __html: postItem.content }}/>
          </div>
        </Grid>
        <Grid item direction={"column"}>
          <Reply board={BoardType.free} postingId={id} />
        </Grid>
      </Grid>
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    null
  );

  return <Box sx={{ padding: "2rem 10rem 4rem" }}>
    {
      loading ? PostDetails : <PostingSkeleton />
    }
  </Box>;
};

export default FreeDetails;
