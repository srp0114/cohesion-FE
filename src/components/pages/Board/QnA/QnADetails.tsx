import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, Chip, Grid, Stack, Zoom } from "@mui/material";
import Reply from "../../../layout/Reply/Reply";
import { skillData } from "../../../data/SkillData";
import Money from "@mui/icons-material/MonetizationOn";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { PageName } from "../../../layout/postingDetail/postingCrumbs";
import Loading from "../../../layout/Loading";
import { BoardType } from "../../../model/board";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import Bookmark from "../../../layout/Bookmark";
import TimeAndViews from "../../../layout/postingDetail/TimeAndViews";

// Q&A 상세보기 데이터
interface DetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string | null;
  stuId: number;
  createdDate: string;
  modifiedDate?: string;
  language?: string;
  bookmark: number;
  views: number; //조회수
  reply: number;
  point: number;
}

//Q&A 상세보기
const QnADetails = () => {
  //postItem은 상세보기에 들어갈 데이터 - DetailItems에 데이터 타입 지정
  const [postItem, setPostItem] = useState<DetailItems | undefined>();
  const [writerId, setWriterId] = useState<number>(0)
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const { id } = useParams() as { id: string };
  const postingId = Number(id);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/questions/detail/" + id,
    })
      .then((res) => {
        if (res.status === 200) {
          setPostItem(res.data);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("로그인 x");
        } else if (err.response.status === 403) {
          console.log("권한 x");
        }
      });

    // 해당 게시글 작성자의 userId 받아오기
    axios({
      method: "get",
      url: `/api/questions/return/user-id/${id}`
    }).then((res) => {
      if (res.status === 200) {
        setWriterId(res.data);
      }
    }).catch((err) => {
      console.log(err);
    });

    //접속 유저가 해당 게시글의 작성자인지 체크 => 접속한 유저정보
    getCurrentUserInfo()
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));
  }, []);

  //입력된 언어 맞게 이미지 출력
  const Skill = postItem?.language ? 
    skillData.map((value) => {
      if (postItem.language === value.name) {
        return (
          <img src={value.logo} width="35" height="35" />
        )
      }
    }) : null

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
        return (<UpdateSpeedDial boardType={BoardType.question} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

  const PostDetails = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"1.5rem"} mb={"1rem"}>
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="questions" />
        </Grid>
        <Grid item xs={12}>
          {Skill}
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}>
            <Typography variant="h1">{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="modified" size="small" variant="outlined" color="error" />}
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{display: "flex", justifyContent: "space-between"}}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}
          >
            {userInfo(postItem.writer, postItem.stuId, postItem.profileImg)}
            {TimeAndViews (postItem.createdDate, postItem.views)}
          </Stack>
           <Bookmark boardType={"questions"} id={id} />
        </Grid>
        <Grid item xs={12} sx={{ m: "4rem 2rem 5rem 2rem" }}>
        <div className="ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: postItem.content }}
          />
        </div>
        </Grid>
      </Grid>
      <Reply board={"questions"} writerId={writerId} postingId={id} />
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    <Loading />
  );

  return (
    <>
      <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
        {PostDetails}</Box>
    </>
  );
};

export default QnADetails;
