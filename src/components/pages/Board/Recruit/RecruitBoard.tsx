import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../layout/Header";
import FilterPosting from "../../../layout/FilterPosting";
import Time from "../../../layout/Time";
import {
  Avatar,
  Box,
  Container,
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
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
//import { User } from "../../../model/user";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import { data } from "../../../data/RecruitData";

//모집게시판 페이지 인터페이스
export interface RecruitBoardItems {
  id: number;
  title: string;
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

const test = data; //목업데이터

const RecruitBoard: React.FC = () => {
  /**
   *  각각의 게시글 미리보기를 목록화해서 뿌려준다.
   */
  const displayPosting = test.map((element, idx) => (
    <Grid xs={4}>
      <RecruitCard {...element} key={idx} />
    </Grid>
  ));

  return (
    <>
      <Container>
        <Header />
        <Box
          sx={{

          }}
        >
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
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {displayPosting}
            </Grid>
          </Box>
        </Box>{" "}
        {/*추후에 이 부분 컴포넌트 분리하기*/}
        <p></p>
        {/*space for paginationControl*/}
      </Container>
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

  return (
    <Card>
      <CardActionArea onClick={() => goToPost(props.id)}>
        <CardHeader
          title={props.title}
          subheader={<Time date={props.createdDate} />}
        />

        <CardContent>
          <Stack direction="row">
            <Avatar
              srcSet={props.profileImg as string}
              sx={{ width: "20px", height: "20px", marginRight: "5px" }}
            />
            <Typography variant="overline">
              {`${props.writer} (사용자 학번)`}
            </Typography>
          </Stack>

          <Box sx={{ marginBottom: 1 }}>
            <Typography>Requirement</Typography>
            <Typography variant="body1">{props.require}</Typography>
            <Typography>Optional</Typography>
            <Typography variant="body1">{props.optional}</Typography>
            {/* 이미지에 대해서는 추후 논의 후 추가)*/}
          </Box>
        </CardContent>

        <CardContent>
          <Typography>
            {props.gathered} / {props.party}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Stack direction="row">
          <IconButton size="small">
            <Person2OutlinedIcon /> {props.views}
          </IconButton>
          <IconButton size="small">
            <BookmarkIcon /> {props.bookmark}
          </IconButton>
          <IconButton size="small">
            <ChatIcon /> {props.reply}
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default RecruitBoard;
