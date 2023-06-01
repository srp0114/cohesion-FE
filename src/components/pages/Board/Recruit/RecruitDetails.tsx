import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles"
import Time from "../../../layout/Time";
import { Box, Button, Chip, Divider, Grid, Stack, Typography, IconButton, Zoom, Tooltip, SnackbarOrigin } from "@mui/material";
import axios from "axios";
import Reply from "../../../layout/Reply/Reply";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { replyCount } from "../../../layout/postingDetail/replyCount";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { UpdateRecruitSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import Bookmark from "../../../layout/Bookmark";
import TimeAndViews from "../../../layout/postingDetail/TimeAndViews";
import { ApplicantList, DoubleCheckModal, } from "./ApplyAcceptStuff";
import { Application } from "./ApplyAcceptStuff";
import File from "../../../layout/File";
import { FileItem } from "../Free/FreeDetails";
import { PostingSkeleton, useSkeleton } from "../../../layout/Skeletons";
import { FindIcon } from "../../../data/IconData";
import 'highlight.js/styles/stackoverflow-dark.css'
import "highlight.js/styles/atom-one-dark.css";
import { resolveModuleName } from "typescript";

export interface State extends SnackbarOrigin {
  open: boolean;
}

//모집 상세보기 인터페이스
export interface RecruitDetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string | null; //사용자 프로필 사진 img 링크. 현재는 <Avartar />의 기본 이미지가 들어감
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  stuId: number; //사용자 학번
  introduce: string;
  imgUrl?: Array<string>; //이미지
  require: string; //필수조건: 분반명 등
  optional?: string; //기타, 우대조건: 학점, 기술스택 등
  party: number; //모집할 인원수

  gathered: number; //모집된 인원 수
  isCompleted: boolean;
}

const RecruitDetails = () => {
  const { id } = useParams() as { id: string };
  const [postItem, setPostItem] = useState<RecruitDetailItems | undefined>();

  const [modalOpen, setModalOpen] = useState<boolean>(false); //신청, 승인, 모집완료 모달 open 상태 
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const [applicantStatus, setApplicantStatus] = useState<boolean | null>(null); //유저의 신청 및 승인 여부

  const [approvedApplicants, setApprovedApplicants] = useState<0 | 1 | -1 | number>(0); //승인된 인원수
  const [applicants, setApplicants] = useState<number>(0); //신청인원수
  const [gathered, setGathered] = useState<number>(0); //모인인원
  const [party, setParty] = useState<number>(0); //총 인원수
  const [isCompleted, setIsCompleted] = useState<boolean>(false); //모집완료가 되었나? (버튼을 눌러)
  const [remain, setRemain] = useState<number>(-1); //모집 완료가 되었나? (인원이 차 자동 모집완료)
  const [fileList, setFileList] = useState<FileItem[]>([]);

  const _theme = useTheme();
  const postingId = Number(id);

  const handleModalOpenChange = () => {
    setModalOpen(false);
  }

  const handleApplicantStatus = () => {
    //신청하는 경우
    if (approvedApplicants === null) setApplicantStatus(false);
    //false나 true면 (신청취소) null로
    else if (typeof approvedApplicants === 'boolean')
      setApplicantStatus(null);
  }

  const handleNewApplicant = () => { //신청하기로 인한 신청자 인원 증가
    setApplicants(prevState => prevState + 1);
    setApplicantStatus(false);
  }

  const handleApplicantOut = () => { //신청취소로 인한 신청자 인원 감소
    setApplicants(prevState => prevState - 1);
    setApplicantStatus(null);
  }

  const handleNewApprovedApplicants = () => { //승인하기로 인한 승인 인원 증가
    setApprovedApplicants(1);
  }

  const handleApprovedApplicantsOut = () => { //승인취소로 인한 승인 인원 감소
    setApprovedApplicants(-1);
  }

  const handleIsCompletedChanged = () => {
    setIsCompleted(true);
  }

  useEffect(() => {
    if (remain === 0) {
      //모집인원이 0이 되어 모집이 마감되었을 때,
      alert(`필요한 인원이 모두 모여 모집이 완료되었습니다!`);
    }
  }, [remain]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/recruit/detail/" + id,
    })
      .then((res) => {
        if (res.status === 200) {
          setPostItem(res.data);
          setIsCompleted(res.data.isCompleted);
          setGathered(res.data.gathered);
          setParty(res.data.party);
          setRemain(res.data.party - res.data.gathered);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    getCurrentUserInfo()
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));

    axios({ //신청자 목록의 인원수
      method: "get",
      url: `/api/recruit/${postingId}/applicants-number`,
    }).then((res) => {
      if (res.status === 200) {
        setApplicants(applicants);
        console.log(`useEffect 시행 후의 신청인원수 ${applicants}`);
      }
    }).catch((err) => console.log(err));

    axios({
      method: "get",
      url: `/api/recruit/${id}/file-list`
    })
      .then((res) => {
        setFileList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [gathered]);

  useEffect(() => {
    //승인된 인원수 + 기존에 작성자가 선택한 gathered = 모인인원.
    setGathered(gathered + approvedApplicants);
    setApprovedApplicants(0);
  }, [approvedApplicants]);

  useEffect(() => {
    axios({ //신청자 목록의 인원수
      method: "get",
      url: `/api/recruit/${postingId}/applicants-number`,
    }).then((res) => {
      if (res.status === 200) {
        setApplicants(res.data);
        console.log(`useEffect 시행 후의 신청인원수 ${applicants}`);
      }
    }).catch((err) => console.log(err));
  }, [applicants]);

  //신청 및 승인 여부확인
  useEffect(() => {
    axios({
      method: "get",
      url: `/api/recruit/${postingId}/application-check`
    }).then((res) => {
      if (res.status === 200) {
        setApplicantStatus(res.data);
        console.log(`서버에서 받은 신청자 신청여부 ${res.data} ${JSON.stringify(res.data)}`);
        const status: string = (res.data).toString();
        switch (status) {
          case "":
            break;
          case "true":
            alert(`신청이 승인되었습니다!`);
            break;
          case "false":
            alert(`승인 대기 중입니다!`);
            break;
          default:
            alert(`res.data: ${JSON.stringify(res.data)} ${JSON.stringify(applicantStatus)} 오류 발생`);
            break;
        }
      }
    })
  }, []);

  const loadingStatus: boolean = useSkeleton(800);

  /**
 * 글 작성자에게 게시글 수정, 삭제 버튼을 보여줌.
 */
  const displayUpdateRecruitSpeedDial = (studentId: number, title: string, content: string, handleNewApprovedApplicants: () => void, handleApprovedApplicantsOut: () => void) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) { //accessUserId는 현재 접속한 유저의 학번, stuId
        return (<UpdateRecruitSpeedDial boardType={BoardType.recruit} postingId={postingId} postingTitle={title} postingContent={content}
          onNewApprovedApplicants={handleNewApprovedApplicants} onApprovedApplicantsOut={handleApprovedApplicantsOut}
        />);
      }
      else
        return null;
    }
  }

  const detailPosting = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"2rem"} mb={"0.5rem"}>
        {/*게시판 이름, BreadCrumbs */}
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="recruit" />
        </Grid>
        {/*게시글 제목, 수정 표시, 파티원 (1 / 9999) */}
        <Grid item container xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <Grid item sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography variant="h1" sx={{ fontWeight: "600", textWrap: "balance" }}>{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="수정됨" size="small" variant="outlined" />}
          </Grid>

          <Grid item sx={{ display: "flex", flexDirection: "row-reverse", alignItems: "center" }}>
            <FindIcon name="recruitPeople" iconProps={{ fontSize: "large", color: "primary" }} />
            <Stack direction="row" sx={{ margin: 1 }} >
              <Typography variant="h3" color="info">
                {`${postItem.gathered}/${postItem.party}명`}
              </Typography>
            </Stack>
          </Grid>

        </Grid>
        {/*작성자 정보 , 작성 시각 */}
        <Grid item container xs={12} md={8} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
            >
              {userInfo(postItem.writer, postItem.stuId, postItem.profileImg, postItem.introduce)}
              {TimeAndViews(postItem.createdDate, postItem.views)}
            </Stack>
          </Grid>
          <Grid item>
            <Bookmark boardType={"recruit"} id={id} />
          </Grid>
        </Grid>
        {/*게시글 내용 */}
        <Grid item xs={12} sx={{ m: "1rem 2.5rem", width: "100%" }}>
          <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
        </Grid>
        <Divider sx={{ margin: "2rem 0" }} />

        <Grid item container xs={12} spacing={"3rem"} sx={{ marginBottom: "4rem" }}>

          <Grid item container xs={12} md={6}>
            <Grid item xs={12}>
              <Chip label="필수" variant="outlined" color="error" sx={{ marginBottom: "1rem", textWrap: "balance" }} />
              <Typography variant="h4" sx={{ textWrap: "balance" }}>
                <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
              </Typography>
            </Grid>
            {
              postItem.optional ?
                <Grid item xs={12} sx={{ marginTop: "2rem" }}>
                  <Chip label="우대" variant="outlined" sx={{ marginBottom: "1rem", textWrap: "balance" }} />
                  <Typography variant="h4" sx={{ textWrap: "balance" }}>
                    <div dangerouslySetInnerHTML={{ __html: postItem.optional }} />
                  </Typography>
                </Grid> : null
            }
          </Grid>

          <Grid item container xs={12} md={6} rowSpacing={2} sx={{ display: "flex", alignContent: "end", alignItems: "end", textAlign: "bottom" }}>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "row-reverse" }}>
              {/* 게시글 작성자: 모집완료 버튼과 신청자 목록, 일반 사용자: 신청하기 버튼 */}
              {/* 모집완료 버튼과 신청하기 버튼을 클릭하면, 더블체킹을하는 모달. */}
              {(Number(postItem.stuId) === Number(accessUserId)) //게시글 작성자의 학번 === 접속한유저의학번
                ? <>
                  <Chip label="모집완료" variant="outlined" onClick={() => setModalOpen(true)} disabled={isCompleted} />
                  <DoubleCheckModal modalOpen={modalOpen} who={true} callNode="completeBtn" id={accessUserId} postingId={postingId}
                    onModalOpenChange={handleModalOpenChange} onIsCompletedChanged={handleIsCompletedChanged} />
                </>
                : <>
                  <Tooltip title={((typeof applicantStatus !== 'boolean') ? "신청하기" : "신청취소")}>
                    <Chip label={((typeof applicantStatus !== 'boolean') ? "신청하기" : "신청취소")}
                      variant="outlined"
                      onClick={() => setModalOpen(true)}
                      color={((typeof applicantStatus !== 'boolean') ? "primary" : "secondary")}
                    />
                  </Tooltip>
                  <DoubleCheckModal modalOpen={modalOpen} who={false} callNode={((typeof applicantStatus !== 'boolean') ? "applyBtn" : "applyCancelBtn")} id={accessUserId} postingId={postingId}
                    requireContext={postItem.require} optionalContext={postItem.optional}
                    onModalOpenChange={handleModalOpenChange} onApplicantOut={handleApplicantOut} onNewApplicant={handleNewApplicant} onApplicantStatus={handleApplicantStatus} />
                </>
              }
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "row-reverse" }}>
              <Stack direction="row">
                <Typography variant="h5" sx={{ marginRight: "0.5rem" }}>{`지금까지 `}</Typography>
                <Typography variant="h3" color="primary" sx={{ marginRight: "0.25rem" }}>{`${applicants}명`}</Typography>
                <Typography variant="h5">{`이 신청했어요!`}</Typography>
              </Stack>
            </Grid>
          </Grid>

        </Grid>
        {fileList.length > 0 &&
          <Grid item xs={12}>
            <File fileList={fileList} />
          </Grid>
        }
        <Grid item xs={12}>
          <Reply board={BoardType.recruit} postingId={id} />
        </Grid>
      </Grid>
      <Zoom in={true}>
        <Box>{displayUpdateRecruitSpeedDial(postItem.stuId, postItem.title, postItem.content, handleNewApprovedApplicants, handleApprovedApplicantsOut)}</Box>
      </Zoom>
    </>
  ) : (
    null
  );

  return <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
    {
      loadingStatus ? detailPosting : <PostingSkeleton />
    }
  </Box>;
}

export default RecruitDetails;
