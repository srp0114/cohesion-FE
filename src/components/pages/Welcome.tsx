import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  ButtonBase,
  ListItemAvatar,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { skillData } from "../data/SkillData";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import "../style/Board.css";
import profileImg from "../asset/image/react.png";
import { styled } from "@mui/material/styles";
import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";
import { useNavigate } from "react-router";

// 회원가입 데이터- 받아온 정보
interface UserAccountItems {
  sub: number; //학번
  name: string; //이름
  track1: string; //1트랙
  track2: string; //2트랙
  picture: string; //프로팔
}

const TestUserAccount: UserAccountItems = {
  sub: 2071274,
  name: "김서영",
  track1: "웹공학 트랙",
  track2: "모바일소프트웨어 트랙",
  picture: profileImg, //기존에 있던 파일 이용 - 상단에 임포트
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
    "& .MuiImageBackdrop-root": {
      opacity: 0,
    },
  },
  "&:focus, &.Mui-focus": {
    border: "2.5px solid #0d47a1",
  },
  border: "1px solid #e0e0e0",
  borderRadius: 20,
}));

const Welcome: React.FC = () => {
  const [profileImg, setProfileImg] = useState("");
  const [userAccount, setUserAccount] =
    useState<UserAccountItems>(TestUserAccount); // initialState 변경 필요
  const navigate = useNavigate();

  useEffect(() => {
    idTokenVerifier();
  }, []);

  const idTokenVerifier = () => {
    const verifier = new IdTokenVerifier({
      issuer: "http://localhost:8081", // issuer 가 같은지
      audience: "client", // audience 가 같은지
      jwksURI: "http://localhost:8081/oauth2/jwks", // get public key
    });

    const id_token = sessionStorage.getItem("id_token");

    if (id_token) {
      verifier.verify(id_token, (error, payload: any) => {
        if (error) {
          alert("토큰이 만료되었습니다.");
          return;
        }
        setUserAccount(payload);
        if (payload) setProfileImg(payload.picture);
      });
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/";
    }
  };

  //닉네임, 관심기술, 자기소개
  const [defaultNickname, setDefaultNickname] = useState<string>(userAccount.name);
  const [nickname, setNickname] = useState<string>("");
  const [skill, setSkill] = useState<typeof skillData>([]);
  const [introduce, setIntroduce] = useState<string>("");

  //닉네임, 자기소개 핸들러
  const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultNickname(event.target.value);
    setNickname(event.target.value);
    console.log(nickname);
  };

  const onIntroduceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduce(event.target.value);
    console.log(introduce);
    console.log(skill);
  };

  const request_data = {
    studentId: userAccount.sub,
    name: userAccount.name,
    nickname: nickname,
    introduce: introduce,
    track1: userAccount.track1,
    track2: userAccount.track2,
  };

  const confirm = () => {
    axios({
      method: "post",
      url: "/api/join",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(request_data),
    })
      .then((response) => {
        if (response.status === 200) { // 부가 정보 입력 정상 완료 시
          navigate("/"); // 메인 페이지로 이동
        } // 에러 핸들링 ...
      })
      .catch((error) => {
        console.error(error);
      });
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
                    <Avatar alt="Travis Howard" src={profileImg} />
                  </ListItemAvatar>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      p: 4,
                    }}
                  >
                    {defaultNickname}
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
              value={userAccount.name}
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
              value={userAccount.sub}
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
                value={userAccount.track1}
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
                value={userAccount.track2}
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
              options={skillData}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
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
            <Button variant="contained" onClick={confirm}>
              완료
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Welcome;
