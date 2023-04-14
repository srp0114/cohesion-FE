import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Time from "../../../layout/Time";
import { Avatar, Box, Stack, Typography, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { data } from "../../../data/RecruitData";
import axios from "axios";

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

const RecruitDetails: React.FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [postItem, setPostItem] = useState<RecruitDetailItems | undefined>();

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/recruit/detail/" + id,
    })
      .then((res) => {
        if (res.status === 200) {
          setPostItem(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const detailPosting = postItem ? (
    <>
      <Box sx={{ paddingLeft: 3, paddingRight: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 1, fontWeight: 600 }}>
            {postItem.title}
          </Typography>
          <Typography variant="caption">
            <Time date={postItem.createdDate} />
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 5 }}>
          <Stack direction="row">
            <Avatar
              srcSet={postItem.profileImg as string}
              sx={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <Typography variant="body2">
              {`${postItem.writer} (사용자 학번)`}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ marginBottom: 1 }}>
          <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
          {/* 이미지에 대해서는 추후 논의 후 추가)*/}
          {!postItem.optional ? (
            <></>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: postItem.optional }} />
          )}
        </Box>
        <Box borderRadius={7}>
          <Typography variant="h4">
            {postItem.gathered} / {postItem.party}
          </Typography>
        </Box>
        <Box sx={{ marginTop: 3, marginBottom: 3 }}>
          <Stack direction="row" sx={{ disply: "flex", justifyContent: "end" }}>
            <IconButton size="small">
              <Person2OutlinedIcon /> {postItem.views}
            </IconButton>
            <IconButton size="small">
              <BookmarkIcon /> {postItem.bookmark}
            </IconButton>
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{ marginBottom: 5, paddingLeft: 3, fontWeight: 600 }}
          >
            {`${postItem.reply}개의 댓글이 있습니다.`}
          </Typography>
          <Box sx={{ border: "1px solid #787878", height: "50%" }}>
            {/*은서: 추후 이곳에 댓글 목록, 댓글 작성란 등 컴포넌트 추가하기*/}
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <Typography>no data</Typography>
  );

  return (
    <>
      <Box
        sx={{
          borderLeft: "1px solid black",
          borderRight: "1px solid black",
          padding: 10,
        }}
      >
        {detailPosting}
      </Box>
    </>
  );
};

export default RecruitDetails;
