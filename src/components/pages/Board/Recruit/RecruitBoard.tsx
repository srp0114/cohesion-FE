import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterPosting from "../../../layout/FilterPosting";
import Time from "../../../layout/Time";
import {
  Avatar,
  Box,
  Chip,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material/styles";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import Profile from "../../../layout/Profile";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import { Application } from "./ApplyAcceptStuff";

//모집게시판 페이지 인터페이스
export interface RecruitBoardItems {
  id: number;
  title: string;
  writer: string;
  profileImg: string | null;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  stuId: number; //사용자 학번
  imgUrl?: Array<string>; //이미지
  require: string;
  optional?: string;
  party: number;
  gathered: number; //모집된 인원 수. User 완성되는대로 Array<User>로 변경

  isCompleted: boolean;
  accessUserId: number; //접속한 유저의 아이디(학번)
  authorizedUserIds: number[]; //권한있는 사용자들의 아이디(학번), 작성자와 승인된 사용자들
}


const RecruitBoard: React.FC = () => {
  /**
   *  각각의 게시글 미리보기를 목록화해서 뿌려준다.
   */
  const [boardItems, setBoardItems] = useState<RecruitBoardItems[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);

  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/recruit/total"
    })
      .then((res) => {
        if (res.status === 200) {
          setTotal(res.data);
        }
      });

    getCurrentUserInfo() //유저가 작성자나 승인된 사용자인지 검증.
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));

  }, [])

  useEffect(() => {
    const curPage = page - 1;
    axios({
      method: "get",
      url: "/api/recruit/list?page=" + curPage + "&size=6",
    })
      .then((res) => {
        setBoardItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [page])

  const displayPosting = boardItems.map((element, idx) => (
    <Grid lg={4}>
      <RecruitCard {...element} key={idx} />
      <Typography>{element.isCompleted}</Typography>
    </Grid>
  ));

  return (
    <>
      <Box>
        <Typography
          variant="h5"
          sx={{ marginBottom: 5, paddingLeft: 3, fontWeight: 600 }}
        >
          모집게시판
        </Typography>
        <FilterPosting />
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            rowSpacing={4}
            columnSpacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems="stretch"
          >
            {displayPosting}
          </Grid>
        </Box>
      </Box>
      <PaginationControl
        page={page}
        between={1}
        total={total}
        limit={6}
        changePage={(page: React.SetStateAction<number>) => setPage(page)}
        ellipsis={1}
      />
      <WritingButton />
    </>
  );
};

const RecruitCard: React.FunctionComponent<RecruitBoardItems> = (
  props: RecruitBoardItems
) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/recruit/${postId}`);
  };

  const [remain, setRemain] = useState<number>(props.party - props.gathered); //모집 인원 계산

  useEffect(() => {
    if (remain === 0) {
      //모집인원이 0이 되어 모집이 마감되었을 때,
      console.log(`${props.id}의 모집 마감`);
    }

  }, [remain]);

  const _theme = useTheme(); //시스템에 설정된 theme 불러옴(style/theme.tsx파일)
  const _recruitTheme = createTheme(_theme, {
    components: {
      MuiCard: {
        defaultProps: {
          //기본 props 설정
          raised: false, //양각 스타일 사용안함
        },
        styleOverrides: {
          //css 설정, rule네임에 따라
          root: { //모집 완료된 게시글은 배경색이 palette.neutral(회색)
            backgroundColor: (!props.isCompleted) ? _theme.palette.background : _theme.palette.neutral,
            boxShadow: "none",
            border: (!props.isCompleted) ? `1px solid ${_theme.palette.info.main}` : `1px solid ${_theme.palette.warning.main}`,
            borderRadius: "20px",
            padding: "0 10px 10px",
            height: "100%",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            margin: 0,
            paddingBottom: 0,
          },
          title: {
            fontSize: "1.25rem",
            fontWeight: 500,
            color: (!props.isCompleted) ? _theme.palette.primary.main : _theme.palette.warning.main,
          },
          subheader: {
            color: (!props.isCompleted) ? _theme.palette.secondary.main : _theme.palette.warning.main,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            fontSize: "1rem",
            color: (!props.isCompleted) ? _theme.palette.info.main : _theme.palette.warning.main,
            paddingTop: 0,
          },
        },
      },
      MuiCardActions: {
        defaultProps: {
          disableSpacing: true,
        },
        styleOverrides: {
          root: {
            color: (!props.isCompleted) ? _theme.palette.info.main : _theme.palette.warning.main,
          },
          spacing: {
            disableSpacing: true,
          },
        },
      },
      MuiCardActionArea: {
        //CardActionArea는 ButtonBase의 props도 사용가능하기때문에
        defaultProps: {
          disableRipple: true, //버튼 누를 때의 효과 잔물결 효과 사라짐.
        },
      },
    },
  });

  return (
    <ThemeProvider theme={_recruitTheme}>
      <Card>
        <CardHeader
          subheader={
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Time date={props.createdDate} variant="h6" />
            </div>
          }
        />
        <CardActionArea onClick={() => {//승인된 사용자 검증하려면...신청자목록 받아와야할텐데
          // axios({
          //   method: "get",
          //   url: `/api/recruit/${props.id}/applicants`
          // }).then((res) => {
          //   if (res.status === 200) {
          //     console.log(`구인 게시글에서 신청자 목록을 받아옵니다.: ${res.data}`);
          //     const approvedApplicantsArray: Application[] = res.data.filter((app: Application) => app.isApproved); //신청자 목록 중 승인된 유저만 필터링
          //     const foundApplicant = approvedApplicantsArray.find((app: Application) => app.studentId === props.accessUserId);
          //     if ((foundApplicant && props.isCompleted) || (!props.isCompleted)) {
          //       goToPost(props.id);
          //     } else {
          //       alert("작성자 혹은 승인된 유저만 해당 게시글에 접근 가능합니다.");
          //     }
          //   }
          // }).catch((err) => { console.log(`구인 게시글에서 신청자 목록을 받아옵니다.: ${err}`) })
          ((props.accessUserId === props.stuId && props.isCompleted) || (!props.isCompleted)) ? goToPost(props.id) :  alert("모집완료된 게시글은 작성자만 접근 가능합니다.")
        }}>

          <CardHeader
            title={<Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
              <Typography variant="h5">{props.title}</Typography>
              {(typeof props.modifiedDate === 'object') ?
                null : <Chip label="modified" size="small" variant="outlined" color="error" />}
            </Stack>}
            subheader={
              <Stack direction="row">
                <Profile nickname={props.writer} imgUrl={props.profileImg} size={30} />
                <Typography variant="overline">
                  {`${props.writer} (${props.stuId.toString().slice(0, 2)}학번)`}
                </Typography>
              </Stack>
            }
          />
          <CardHeader subheader="필수 조건" />
          <CardContent>{props.require}</CardContent>
          {props.optional && <CardHeader subheader="우대 조건" />}
          <CardContent>{props.optional}</CardContent>
        </CardActionArea>

        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row">
            <IconButton
              size="small"
              disableFocusRipple={true}
              disableRipple={true}
            >
              <Person2OutlinedIcon /> {props.views}
            </IconButton>
            <IconButton size="small">
              <BookmarkIcon /> {props.bookmark}
            </IconButton>
            <IconButton size="small">
              <ChatIcon /> {props.reply}
            </IconButton>
          </Stack>
          <Box>
            <Typography variant="h5">
              {(remain === 0 || props.isCompleted) ? "모집 마감" : `${remain}명 모집 중`}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </ThemeProvider >
  );
};

export default RecruitBoard;