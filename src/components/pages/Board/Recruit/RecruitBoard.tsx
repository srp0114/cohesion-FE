import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Link
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material/styles";
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import Profile from "../../../layout/Profile";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import SearchBoardField from "../../../layout/SearchBoardField";
import SortBoard from "../../../layout/SortBoard";
import { reply_bookmark_views_recruit } from "../../../layout/Board/reply_bookmark_views";
import Shorten from "../../../layout/Shorten";
import { RecruitBoardSkeleton, useSkeleton } from "../../../layout/Skeletons";


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
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('page');
  const [page, setPage] = useState<number>(currentPage ? parseInt(currentPage) : 1);
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>("createdAt,desc");

  useEffect(() => {
    getCurrentUserInfo() //유저가 작성자나 승인된 사용자인지 검증.
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));
  }, [])

   const getBoardItems = (search?: string) => {
    const curPage = page - 1;
    const params = { size: 9, sort: sort };
    let url = `/api/recruit/list?page=${curPage}`;

    if(search !== undefined) {
      url += `&search=${search}`;
    }
    
    setSearchParams({page: page.toString()})
    axios({
      method: "get",
      url: url,
      params: params
    })
    .then((res) => {
      if (res.status === 200) {
        setBoardItems(res.data.data);
        setTotal(res.data.count);
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        console.log("로그인 x");
      } else if (err.response.status === 403) {
        console.log("권한 x");
      }
    });
  }

  useEffect(() => {
    getBoardItems(search);
  }, [page, search, sort]);

  const loadingStatus: boolean = useSkeleton(800, boardItems);

  const displayPosting = boardItems.map((element, idx) => (
    <Grid xs={12} md={6} lg={4}>
      <RecruitCard {...element} key={idx} />
      <Typography>{element.isCompleted}</Typography>
    </Grid>
  ));

  return (
    <>
      {loadingStatus ? (
        <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginBottom: "2.25rem" }}>
            <Typography variant="h2" sx={{ mb: 5, pl: 3, fontWeight: 800 }}>구인게시판</Typography>
            <SortBoard sort={sort} setSort={setSort} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 4 }} alignItems="stretch">
            {boardItems.length === 0 && search !== undefined ? 
              <Stack p={"0rem 2rem 0rem"}>
                <Typography variant="h3" sx={{ color: "secondary.dark", fontWeight: 600 }}>일치하는 검색결과가 없습니다.</Typography>
              </Stack> : displayPosting
            }
            </Grid>
          </Box>
          <Box display={"flex"} justifyContent={"flex-end"} sx={{ marginTop: "2.25rem" }}>
            <SearchBoardField setSearch={setSearch} />
          </Box>
          <PaginationControl
            page={page}
            between={1}
            total={total}
            limit={9}
            changePage={(page: React.SetStateAction<number>) => setPage(page)}
            ellipsis={1}
          />
        </Box>
      ) : (
        <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <RecruitBoardSkeleton />
        </Box>
      )}
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
            backgroundColor: (!props.isCompleted) ? _theme.palette.background : "#dddddd",
            boxShadow: "none",
            border: (!props.isCompleted) ? `1px solid black` : `1px solid ${_theme.palette.neutral.main}`,
            borderRadius: "35px",
            padding: "2rem",
            height: "100%",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            margin: 0,
            padding: 0,
          },
          title: {
            fontSize: "1.25rem",
            fontWeight: 500,
            color: (!props.isCompleted) ? "#000000" : _theme.palette.neutral.dark,
          },
          subheader: {
            color: (!props.isCompleted) ? "#000000" : _theme.palette.neutral.dark,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            fontSize: "1rem",
            color: (!props.isCompleted) ? "#000000" : _theme.palette.neutral.dark,
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
            color: (!props.isCompleted) ? _theme.palette.info.main : _theme.palette.neutral.main,
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
        styleOverrides: {
          focusHighlight: {
            background: _theme.palette.background,
          },
        },
      },
    }
  });

  return (
    <ThemeProvider theme={_recruitTheme}>
      <Card onClick={() => goToPost(props.id)} sx={{
        '&:hover': {
          boxShadow: 5,
          pointer: "cursor"
        },
      }}>

        <CardHeader
          /*제목(20자까지)이랑 수정 표시*/
          title={<Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{props.title}</Typography>
            {/* 몇 명 모집 중인지 */}

          </Stack>}
          /* 작성 시간 */
          subheader={
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Time date={props.createdDate} variant="h6" />
            </div>
          }
        />

        <Box sx={{ height: "10rem", alignContent: "flex-start", justifyContent: "center" }}>
          {/* 필수, 우대 조건 */}
          <CardHeader subheader="필수 조건" titleTypographyProps="h6" sx={{ color: _theme.palette.primary.main }} />
          <CardContent sx={{ fontSize: "1rem", color: _theme.palette.primary.main }}>{Shorten(`${props.require}`, 30)}</CardContent>

          {props.optional ? <><CardHeader subheader="우대 조건" titleTypographyProps="h5" />
            <CardContent sx={{ fontSize: "1rem" }}>{Shorten(`${props.optional}`, 30)}</CardContent></> : null}
        </Box>

        {/*댓글수 북마크수 조회수, 모집 인원 수 표시 */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {(remain === 0 || props.isCompleted) ?
            <Typography variant="h6" sx={{ color: _theme.palette.neutral.main }}>"모집 마감"</Typography>
            : <Typography variant="h6" sx={{ color: _theme.palette.primary.main }}>{remain}명 모집 중</Typography>}
          {reply_bookmark_views_recruit(props)}
        </Box>

        <CardHeader
          /* 작성자 프로필, 닉네임, 학번, 수정됌 표시 */
          subheader={
            <Stack direction="row">
              <Profile nickname={props.writer} imgUrl={props.profileImg} size={30} />
              <Typography variant="overline">
                {`${props.writer} (${props.stuId.toString().slice(0, 2)}학번)`}
              </Typography>
            </Stack>
          } />

      </Card>
    </ThemeProvider >
  );
};

export default RecruitBoard;