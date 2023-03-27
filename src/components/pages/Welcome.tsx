import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Stack,
  ButtonBase,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { languageImage } from "../data/Image";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import "../style/Board.css";
import profileImg from "../asset/image/react.png";
import { styled } from "@mui/material/styles";

// 회원가입 데이터- 받아온 정보
interface UserAccountItems {
  studentId: number; //학번
  name: string; //이름
  password: string; //비밀번호
  track1: string; //1트랙
  track2: string; //2트랙
  profileImg: string; //프로팔
}

const TestUserAccount: UserAccountItems = {
  studentId: 2071274,
  name: "김서영",
  password: "qwe123",
  track1: "웹공학 트랙",
  track2: "모바일소프트웨어 트랙",
  profileImg: profileImg, //기존에 있던 파일 이용 - 상단에 임포트
};

// 추가정보로 입력할 데이터
interface UserInfoItems {
  nickname: string; //닉네임
  skill?: Array<string>; //관심기술 - 최대 5개
  introduce?: string; //자기소개
}

//프로필 선택 버튼
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  width: 350,
  height: 150,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 150,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    border: "2px solid #0d47a1",
    borderRaduis: 20,
    "& .MuiImageBackdrop-root": {
      opacity: 0,
    },
  },
  border: "1px solid #e0e0e0",
  borderRadius: 20,
}));

const Welcome: React.FC = () => {
  //닉네임, 관심기술, 자기소개
  const [nickname, setNickname] = useState<string>();
  const [skill, setSkill] = useState<typeof languageImage>([]);
  const [introduce, setIntroduce] = useState<string>();

  //닉네임, 자기소개 핸들러
  const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    console.log(nickname);
  };

  const onIntroduceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduce(event.target.value);
    console.log(introduce);
    console.log(skill);
  };

  return (
    <>
      <Box sx={{ m: 5, p: 1 }}>
        <Typography variant="h5" align="center">
          추가 정보를 입력해주세요
        </Typography>
        <Typography variant="subtitle1" align="right">
          * 필수항목은 꼭 입력해주세요!
        </Typography>
      </Box>
      <Box sx={{ pl: 15, pr: 15, mb: 5 }}>
        <Stack spacing={5}>
          <Box>
            <Typography>* 프로필을 선택해주세요</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                mt: 2,
              }}
            >
              <Box>
                <ImageButton>
                  <ListItemAvatar>
                    <Avatar
                      alt="Travis Howard"
                      src={TestUserAccount.profileImg}
                    />
                  </ListItemAvatar>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      p: 4,
                    }}
                  >
                    {TestUserAccount.name}
                  </Typography>
                </ImageButton>
              </Box>
              <Box>
                <ImageButton>
                  <ProfileIcon sx={{ fontSize: 50 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      p: 4,
                    }}
                  >
                    {nickname}
                  </Typography>
                </ImageButton>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography>* 이름</Typography>
            <TextField
              disabled
              variant="outlined"
              value={TestUserAccount.name}
              fullWidth
              InputProps={{ sx: { backgroundColor: "#e0e0e0" } }}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box>
            <Typography>* 학번</Typography>
            <TextField
              disabled
              fullWidth
              variant="outlined"
              value={TestUserAccount.studentId}
              InputProps={{ sx: { bgcolor: "#e0e0e0" } }}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "400px" }}>
              <Typography>* 1트랙</Typography>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                value={TestUserAccount.track1}
                InputProps={{ sx: { backgroundColor: "#e0e0e0" } }}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box sx={{ width: "400px" }}>
              <Typography>* 2트랙</Typography>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                value={TestUserAccount.track2}
                InputProps={{ sx: { backgroundColor: "#e0e0e0" } }}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
          <Box>
            <Typography>* 닉네임</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="닉네임을 입력해주세요!"
              onChange={onNicknameChange}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box>
            <Typography>관심기술</Typography>
            <Autocomplete
              multiple
              options={languageImage}
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={(option) => option.name || ""}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="관심 기술을 선택해주세요."
                />
              )}
              onChange={(event, value) => {
                const addSkill = value;
                setSkill(addSkill);
                console.log(skill);
              }}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box>
            <Typography>자기소개</Typography>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              placeholder="본인소개를 해주세요."
              rows={3}
              onChange={onIntroduceChange}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button sx={{ mr: 1 }}>뒤로</Button>
            <Button variant="contained">완료</Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Welcome;
