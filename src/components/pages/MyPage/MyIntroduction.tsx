import React, {useEffect, useState} from "react";
import { Button, Box, Chip, Grid, IconButton, TextField, Typography, Stack, Paper, Avatar, Modal } from "@mui/material";
import { skillData } from "../../data/SkillData";
import UserSkill from "../../layout/UserSkill";
import UserIntroduce from "../../layout/UserIntroduce";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

interface MyIntroductionProps {
  nickname: string;
  skills: Array<string>;
  introduce: string;
  editUserInfo: (changeNickname: string, changeSkills: string[], changeIntroduce: string) => Promise<void>;
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(props.nickname);
  const [userSkill, setUserSkill] = useState<string[]>(props.skills);
  const [userIntroduce, setUserIntroduce] = useState<string>(props.introduce);
  const [error, setError] = useState<string>("");

  // props.nickname, ... 변동 시 setUserNickname(...), ... 재호출
  useEffect(() => {
    setUserNickname(props.nickname);
    setUserSkill(props.skills);
    setUserIntroduce(props.introduce);
  }, [props.nickname, props.skills, props.introduce])

  const onChangeNickname = (changeNickname: string) => {
    setUserNickname(changeNickname);
  }

  const onChangeSkills = (changeSkills: string[]) => {
    setUserSkill(changeSkills);
  }

  const onChangeIntroduce = (changeIntroduce: string) => {
    setUserIntroduce(changeIntroduce);
  }

  const editMyIntroduce = () => {
    props.editUserInfo(userNickname, userSkill, userIntroduce)
      .then(() => {
        setOpen(false); // 수정 성공, 정보 요청 성공 시 모달 닫기
        setError(""); // 에러 메시지 초기화
      })
      .catch((err) => setError(err.response.data.message)); // 수정 실패 시, 에러 메시지 출력
  }

  return (
    <Paper
      sx={{
        borderRadius: "15px",
        p: "2.5rem",
      }}
      elevation={3}
    >
      <Stack spacing={2} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="h3">{`Hello, ${props.nickname}!`}</Typography>
        <IconButton onClick={() => setOpen(true)}>
          <CreateOutlinedIcon />
        </IconButton>

        <Modal open={open}>
          <Stack sx={editUserinfoModal} direction={"column"} spacing={5}>
            <Typography variant="h1" align="center">내 정보 수정</Typography>
            <Box>
              {/*닉네임 수정*/}
              <Typography variant="h5" pb={"0.6rem"}>닉네임</Typography>
              <UserNickname nickname={props.nickname} changeNickname={onChangeNickname} err={error} />
            </Box>
            <Box>
              <Typography variant="h5" pb={"0.6rem"}>관심기술을 선택해주세요!</Typography>
              <UserSkill skills={props.skills} changeSkills={onChangeSkills} />
            </Box>
            <Box pt={"1rem"}>
              <Typography variant="h5" pb={"0.6rem"}>자기소개</Typography>
              <UserIntroduce introduce={props.introduce} changeIntroduce={onChangeIntroduce} />
            </Box>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <Button onClick={() => {
                setOpen(false);
                setError("");
              }}>취소</Button>
              <Button onClick={editMyIntroduce}>수정</Button>
            </Stack>
          </Stack>
        </Modal>
      </Stack>

      <Grid container rowSpacing={"2rem"} direction="column">
        <Grid item>
          <Typography variant="h5" mt={"1rem"}>{props.introduce}</Typography>
        </Grid>
        <Grid item>
          <Box>
            {props.skills?.map((stack) => {
              const skills = skillData.find((skill) => skill.name === stack);
              const color = skills?.type === "language" ? "default" : "success";
              return (
                <Chip avatar={<Avatar src={skills?.logo} />} label={stack} variant="outlined" color={color} sx={{ mr: "1rem", mb: "0.8rem" }} />
              )
            })}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const editUserinfoModal = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #B5CC6C',
  boxShadow: 20,
  p: "4rem",
  borderRadius: 6,
};


interface UserNicknameProps {
  changeNickname: (nickname: string) => void;
  nickname?: string;
  err?: string;
}

const UserNickname = ({ changeNickname, nickname, err }: UserNicknameProps) => {
  const { control, setError, clearErrors, watch } = useForm({
    mode: "onChange",
    defaultValues: { nickname: nickname },
  });

  return (
    <>
      <Controller
        control={control}
        name="nickname"
        rules={{
          maxLength: {
            value: 8,
            message: "최대 8자까지 입력이 가능합니다",
          },
          minLength: {
            value: 2,
            message: "최소 2자부터 등록이 가능합니다",
          },
        }}
        defaultValue={nickname || ""}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            multiline
            placeholder="새로운 닉네임을 알려주세요!"
            rows={1}
            error={error !== undefined}
            helperText={error ? error.message : ""}
            onChange={(e) => {
              field.onChange(e);
              changeNickname(e.target.value);
            }}
          />
        )}
      />
      {err && <p>{err}</p>} {/* 에러 발생 시 출력 TODO 적절하게 커스터마이징 필요 */}
    </>
  );
};