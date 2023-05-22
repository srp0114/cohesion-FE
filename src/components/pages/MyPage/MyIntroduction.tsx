import React, { useState } from "react";
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
  editUserInfo: (changeNickname: string, changeSkills: string[], changeIntroduce: string) => void
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(props.nickname);
  const [userSkill, setUserSkill] = useState<string[]>(props.skills);
  const [userIntroduce, setUserIntroduce] = useState<string>(props.introduce);

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
    setOpen(false);
    props.editUserInfo(userNickname, userSkill, userIntroduce);
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
              <UserNickname nickname={props.nickname} changeNickname={onChangeNickname} isOnlyNickName={false} />
            </Box>
            <Box>
              <Typography variant="h5" pb={"0.6rem"}>관심기술을 선택해주세요!</Typography>
              <UserSkill skills={props.skills} changeSkills={onChangeSkills} />
            </Box>
            <Box pt={"1rem"}>
              <UserIntroduce introduce={props.introduce} changeIntroduce={onChangeIntroduce} />
            </Box>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <Button onClick={() => setOpen(false)}>취소</Button>
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
  isOnlyNickName?: boolean;
}

const UserNickname = ({ changeNickname, nickname, isOnlyNickName }: UserNicknameProps) => {
  const [isChecking, setIsChecking] = useState<boolean | null>(null);

  const { control, setError, clearErrors, watch } = useForm({
    mode: "onChange",
    defaultValues: { nickname: nickname, isOnlyNickName: isOnlyNickName },
  });

  //닉네임 중복 검사 함수
  const postOnlyNickname = (nickname: string | undefined) => {
    const nicknameValue = nickname || ""; // nickname이 undefined일 경우 기본값으로 빈 문자열 사용
    const request_nickname = {
      nickname: nicknameValue
    };

    axios({
      method: "post",
      url: "/api/user/check-nickname",
      headers: { "Content-Type": "application/json" },
      data: request_nickname,
    })
      .then((res) => {
        if (res.status === 200) {
          if (res.data) {
            setError("nickname", {
              type: "manual",
              message: "이미 누군가가 사용 중인 닉네임입니다.",
            });
          } else {
            clearErrors("nickname");
          }
          setIsChecking(res.data)
        }
      })
      .catch((err) => { console.log(`postOnlyNickname에서 error catch ${err}`) });

  }

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
            helperText={error ? "글자 수를 초과했습니다." : ""}
            onChange={(e) => {
              field.onChange(e);
              changeNickname(e.target.value);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="isOnlyNickName"
        defaultValue={isOnlyNickName ?? true}
        render={({ field }) => (
          <Button
            type="button"
            onClick={() => {
              postOnlyNickname(nickname)
            }}
            variant="outlined"
            color="info"
            size="small"
          >
            중복검사
          </Button>
        )}
      />

      <Chip
        label={!(isOnlyNickName ?? true) ? "중복검사를 통과했습니다" : "중복검사를 통과하지 못했습니다."}
        color={!(isOnlyNickName ?? true) ? "success" : "error"}
        icon={!(isOnlyNickName ?? true) ? <DoneIcon /> : <CloseIcon />}
        size="medium"
        variant="outlined"
      />
    </>
  );
};