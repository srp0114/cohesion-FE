import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Time from "../../../layout/Time";
import { Box, Button, Chip, Grid, Stack, Typography, IconButton, Zoom } from "@mui/material";
import { data } from "../../../data/RecruitData";
import axios from "axios";
import Reply from "../../../layout/Reply/Reply";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { replyCount } from "../../../layout/postingDetail/replyCount";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { PageName } from "../../../layout/postingDetail/postingCrumbs";
import Loading from "../../../layout/Loading";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import Bookmark from "../../../layout/Bookmark";
import { ApplicantList, DoubleCheckModal, Applicant } from "./ApplyAcceptStuff";
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { propTypes } from "react-bootstrap/esm/Image";
import { skillData } from "../../../data/SkillData";
import { profile } from "console";

//모집 상세보기 인터페이스
export interface RecruitDetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string; //사용자 프로필 사진 img 링크. 현재는 <Avartar />의 기본 이미지가 들어감
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  stuId: number; //사용자 학번
  imgUrl?: Array<string>; //이미지
  require: string; //필수조건: 분반명 등
  optional?: string; //기타, 우대조건: 학점, 기술스택 등
  party: number; //모집할 인원수
  gathered: number; //모집된 인원 수. User 완성되는대로 Array<User>로 변경
}

const RecruitDetails = () => {
  const { id } = useParams() as { id: string };
  const [postItem, setPostItem] = useState<RecruitDetailItems | undefined>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  //이하 Applicant에 필요한 데이터
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const [postingId, setPostingId] = useState<number>(Number(id));
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isMeetRequired, setIsMeetRequired] = useState<boolean>(false);
  const [isMeetOptional, setIsMeetOptional] = useState<boolean | undefined>(undefined);
  const [studentId, setStudentId] = useState<number>(-1);
  const [profileImg, setProfileImg] = useState<string>(""); //simpleUser에 profileImg 추가필요
  const [nickname, setNickname] = useState<string>("");
  const [skills, setSkills] = useState<typeof skillData | undefined>(undefined); //simpleUser에 skills 추가필요
  const [introduce, setIntroduce] = useState<string>("");
  const [track1, setTrack1] = useState<string>("미정");
  const [track2, setTrack2] = useState<string>("미정");

  const [party, setParty] = useState<number>(-1);
  const [gathered, setGathered] = useState<number>(-1);


  useEffect(() => {
    axios({
      method: "get",
      url: "/api/recruit/detail/" + id,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`상세보기 첫 입장: ${JSON.stringify(res.data)}`);
          setPostItem(res.data);
          setIsMeetOptional(res.data.optional);
          setParty(res.data.party);
          setGathered(res.data.gathered);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    getCurrentUserInfo()
      .then(userInfo => {
        setAccessUserId(userInfo.studentId);
        setStudentId(userInfo.studentId);
        setNickname(userInfo.nickname);
        setIntroduce(userInfo.introduce);
        // setProfileImg(userInfo.profileImg);
        // setSkills(userInfo.skills);
        setTrack1(userInfo.track1);
        setTrack2(userInfo.track2);
      })
      .catch(err => console.log(err));

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
      if (Number(studentId) === Number(accessUserId)) { //accessUserId는 현재 접속한 유저의 학번, stuId
        return (<UpdateSpeedDial boardType={BoardType.recruit} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

    setIsMeetRequired(isMeetRequired);
    setIsMeetOptional(isMeetOptional);
    setIsApproved(isApproved);

    const ApplicantInfo = {
      postingId: postingId,
      isApproved: isApproved,
      isMeetRequired: isMeetRequired,
      isMeetOptional: isMeetOptional,
      id: accessUserId,
      studentId: studentId,
      profileImg: "../../asset/image/react.png",//profileImg,
      nickname: nickname,
      skills: [{ name: "C", logo: "../../asset/image/c.png" }], //예시데이터
      introduce: introduce,
      track1: track1,
      track2: track2
    };
  

  const detailPosting = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"3rem"}>
        {/*게시판 이름, BreadCrumbs */}
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="recruit" />
        </Grid>
        {/*게시글 제목 */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h1">{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="modified" size="small" variant="outlined" color="error" />}
          </Stack>
        </Grid>
        {/*작성자 정보 , 작성 시각 */}
        <Grid item container xs={12} justifyContent={"space-between"}>
          <Grid item xs={4}>
            {userInfo(postItem.writer, postItem.stuId, postItem.profileImg)}
          </Grid>

          <Grid item justifyContent={"flex-end"}>
            <Time date={postItem.createdDate} variant="h6" />
          </Grid>
        </Grid>

        {/*게시글 내용 */}
        <Grid item xs={12} sx={{ padding: "0 2.5rem" }}>
          <Typography variant="h5">
            <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
            {/* 이미지에 대해서는 추후 논의 후 추가)*/}
          </Typography>
        </Grid>

        <Grid item container xs={12} direction="row" columnSpacing={"3rem"}>
          {!!postItem.optional ? <><Grid item xs={6} md={12}>
            <Typography sx={{ fontSize: "1.75rem" }}>필수</Typography>
            <Typography variant="h5">
              <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
            </Typography>
          </Grid>
            <Grid item xs={6} md={12}>
              <Typography sx={{ fontSize: "1.75rem" }}>우대</Typography>
              <Typography variant="h5">
                <div dangerouslySetInnerHTML={{ __html: postItem.optional }} />
              </Typography>
            </Grid></> : <Grid item xs={12}>
            <Typography sx={{ fontSize: "1.75rem" }}>필수</Typography>
            <Typography variant="h5">
              <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
            </Typography>
          </Grid>}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid item container xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              모인 사람 {postItem.gathered} / 최종 인원 {postItem.party}
            </Typography>
            {/* 게시글 작성자: 모집완료 버튼과 신청자 목록, 일반 사용자: 신청하기 버튼 */}
            {/* 모집완료 버튼과 신청하기 버튼을 클릭하면, 더블체킹을하는 모달. */}
            {(Number(postItem.stuId) === Number(accessUserId)) //게시글 작성자의 학번 === 접속한유저의학번
              ? <>
                <Button variant="outlined" startIcon={<AssignmentTurnedInIcon />} size="small" onClick={() => setModalOpen(true)}>
                  모집완료
                </Button>
                <DoubleCheckModal open={modalOpen} who={true} callNode="completeBtn" applicant={ApplicantInfo}/>
                <ApplicantList {...Object.assign(ApplicantInfo)} />
              </>
              : <>
                <Button variant="outlined" startIcon={<HistoryEduOutlinedIcon />} size="small" onClick={() => setModalOpen(true)}>
                  신청하기
                </Button>
                <DoubleCheckModal open={modalOpen} who={false} callNode="applyBtn" applicant={ApplicantInfo}/>
              </>}
            <Typography variant="h4">신청인원 수: </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Bookmark boardType={"recruit"} id={id} />
        </Grid>
        {replyCount(postItem.reply)}
      </Grid>
      <Reply board={"recruit"} postingId={id} />
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    <Loading />
  );

  return (
    <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>{detailPosting}</Box>
  );
};

export default RecruitDetails;