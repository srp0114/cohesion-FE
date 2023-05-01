import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Zoom
} from "@mui/material";
import Time from "../../../layout/Time";
import Reply from "../../../layout/Reply/Reply";
import { skillData } from "../../../data/SkillData";
import Money from "@mui/icons-material/MonetizationOn";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { replyCount } from "../../../layout/postingDetail/replyCount";
import { bookmarkNviews } from "../../../layout/postingDetail/bookmarkNviews";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { PageName } from "../../../layout/postingDetail/postingCrumbs";
import Loading from "../../../layout/Loading";
import { BoardType } from "../../../model/board";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
/*북마크 연동 후, 위의 두 개 아이콘(bookmark, visivility) 삭제 부탁드립니다.*/

// Q&A 상세보기 데이터
interface DetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string;
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
  const [writerId, setWriterId] = useState<number>(0);
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const { id } = useParams() as { id: string };
  const postingId = Number(id);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/qna/detail/" + id,
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
        method : "get",
        url : `/api/qna/return/user-id/${id}`
      }).then((res)=>{
          if(res.status===200) {
            console.log(res)
            setWriterId(res.data);
          }
      }).catch((err)=>{
          console.log(err);
      });

    //접속 유저가 해당 게시글의 작성자인지 체크 => 접속한 유저정보
    axios({
      method: "get",
      url: "/api/user-info"
    })
      .then((res) => {
        if (res.status === 200) {
          setAccessUserId(res.data.studentId);
        }
      })
      .catch((err) => {

        console.log(err);
      });

  }, []);

  //입력된 언어 맞게 이미지 출력
  const Skill = postItem?.language
    ? skillData.map((value) => {
        if (postItem.language === value.name) {
          return <>
          <Typography sx={{fontSize:"1.75rem"}}>
            <img src={value.logo} width="72" height="72" style={{marginRight:"0.75rem"}}/>
            <span style={{fontWeight:"bold"}}>{postItem.language}</span>에 대한 질문입니다.</Typography></>;
        }
      })
    : null;

  /**
   * 글 작성자에게 게시글 수정, 삭제 버튼을 보여줌.
   * @param studentId 
   * @param title 
   * @param content 
   * @returns 게시글 정보를 포함하고있는 speedDial
   */
  const displayUpdateSpeedDial = (studentId: number, title: string, content: string) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) { //accessUserId는 현재 접속한 유저의 학번, stuId
        return (<UpdateSpeedDial boardType={BoardType.question} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

  const PostDetails = postItem ? (
    //postItems 데이터 있는 경우 출력될 UI
    <>
      <Grid container direction="column" rowSpacing={"3rem"}>
        {/*게시판 이름, BreadCrumbs */}
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="questions" />
        </Grid>
        {/*게시글 제목 */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {postItem.title}
          </Typography>
        </Grid>
        {/*작성자 정보 , 작성 시각 */}
        <Grid item container xs={12} justifyContent={"space-between"}>
          <Grid item xs={4}>
            {userInfo(postItem.writer, postItem.profileImg, postItem.stuId)}
          </Grid>
          <Grid item justifyContent={"flex-end"}>
            <Time date={postItem.createdDate} />{" "}
            {/*은서: Time 컴포넌트 Typography 수정 가능하도록 수정 필요*/}
          </Grid>
        </Grid>

        {/* 질문 분야 */}
        <Grid item xs={12} sm={6} direction="row">
          {Skill}
        </Grid>

        {/*게시글 내용 */}
        <Grid item xs={12} sx={{ padding: "0 2.5rem" }}>
            {/*코드블럭 배경 css 추가*/}
            <div className="ql-snow">
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: postItem.content }}
              />
            </div>
            {/* 이미지에 대해서는 추후 논의 후 추가)*/}
        </Grid>

        <Grid item xs={12} sm={6} direction="row">
          <Typography sx={{fontSize:"1.75rem"}}>채택 시 <Money sx={{ color: "#ffcf40", fontSize: 28 }} /><span style={{fontWeight:"bold"}}>{postItem.point}</span>포인트 지급!</Typography>
        </Grid>

        {/*북마크, 조회수  */}
        <Grid item xs={12} sm={6}>
          <Stack
            direction="row"
            spacing={"0.75rem"}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Box>
              <IconButton size="small" disabled>
                <Visibility fontSize="large" />
                <Typography variant="h5">{postItem.views}</Typography>
              </IconButton>
            </Box>

            <Box>
              <IconButton size="small">
                <BookmarkIcon fontSize="large" />
                <Typography variant="h5">{postItem.bookmark}</Typography>
              </IconButton>
            </Box>
          </Stack>
          {/*bookmarkNviews(postItem.bookmark, onClickBookmark, bookmarkCount) 북마크 기능 추가 시 여기 주석만 지워주시면 됩니다. 은서*/}
        </Grid>
      
        {/*댓글 총 몇 개 인지*/}
        {replyCount(postItem.reply)}
      </Grid>
      {/*댓글 입력창 텍스트필드로 변경*/}
      <Reply board={"qna"} writerId={writerId} postingId={id} />
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    //postItems 데이터 없는 경우
    <Loading />
  );

  return (
    <>
      <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>{PostDetails}</Box>
    </>
  );
};

export default QnADetails;
