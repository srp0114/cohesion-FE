import React, {useEffect, useState} from "react";
import { Button, Box, Chip, Grid, IconButton, TextField, Typography, Stack, Paper, Avatar, Modal, Autocomplete } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { skillData } from "../../data/SkillData";

interface MyIntroductionProps {
  nickname: string;
  skills: string[];
  introduce: string;
  editUserInfo: (changeNickname: string, changeSkills: string[], changeIntroduce: string) => Promise<void>;
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userNickname, setUserNickname] = useState<string>(props.nickname);
  const [userSkill, setUserSkill] = useState<string[]>(props.skills);
  const selectedSkills = skillData.filter((skill) => userSkill?.includes(skill.name));
  const [skill, setSkill] = useState(selectedSkills);
  const [userIntroduce, setUserIntroduce] = useState<string>(props.introduce);
  const { control, setError, clearErrors, watch, handleSubmit } = useForm({ mode: "onChange",});
  
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
      })
      .catch((err) => {
          setError("nickname", { message: err.response.data.message});
          console.log(err)
        }
      );
  }

  return (
    <Paper
      sx={{
        borderRadius: "15px",
        p: "2.5rem",
      }}
      elevation={3}
    >
    <Grid container spacing={"2rem"} direction="column">
      <Grid item>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="h3" sx={{fontWeight:"600"}}>{`Hello, ${props.nickname}!`}</Typography>
        <IconButton onClick={() => setOpen(true)}>
          <CreateOutlinedIcon />
        </IconButton>

        <Modal open={open}>
          <form onSubmit={handleSubmit(editMyIntroduce)}>

          <Stack sx={editUserinfoModal} direction={"column"} spacing={5}>
            <Typography variant="h1" align="center" sx={{fontWeight:"600"}}>내 정보 수정</Typography>
            <Stack direction={"column"} spacing={"3rem"}>
            <Stack direction={"column"} spacing={"1rem"}>
              <Typography variant="h5" pb={"0.6rem"}>닉네임</Typography>
              <Controller
                  control={control}
                  name="nickname"
                  rules={{
                    required : "닉네임을 입력해주세요!",
                    maxLength: {
                      value: 8,
                      message: "최대 8자까지 입력이 가능합니다",
                    },
                    minLength: {
                      value: 2,
                      message: "최소 2자부터 등록이 가능합니다",
                    },
                  }}
                  defaultValue={userNickname}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      placeholder="새로운 닉네임을 알려주세요!"
                      error={error !== undefined}
                      helperText={error ? error.message : ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        onChangeNickname(e.target.value);
                      }}
                    />
                  )}
                />
            </Stack>
            <Stack direction={"column"} spacing={"1rem"}>
              <Typography variant="h5" pb={"0.6rem"}>관심기술을 선택해주세요!</Typography>
              <Controller
                control={control}
                name="skills"
                rules={{
                  validate: (data) => {
                    if (data && data.length > 7) return false;
                  },
                }}
                render={({ field: { ref, onChange, ...field }, fieldState }) => (
                  <Autocomplete
                    multiple
                    value={skill}
                    options={skillData}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, data) => {
                      onChange(data);
                      setSkill(data);
                      onChangeSkills(data.map((s) => s.name));
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                        <img src={option.logo} width={20} height={20} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...field}
                        {...params}
                        fullWidth
                        placeholder="관심기술을 선택해주세요!"
                        inputRef={ref}
                        variant="outlined"
                        error={fieldState.error !== undefined}
                        helperText={fieldState.error ? "관심기술은 5개까지 선택할 수 있습니다." : ""}
                      />
                    )}
                  />
                )}
              />
            </Stack>
            <Stack direction={"column"} spacing={"1rem"}>
              <Typography variant="h5" pb={"0.6rem"}>자기소개</Typography>
              <Controller
                control={control}
                name="introduce"
                rules={{
                maxLength: 100,
                }}
                defaultValue={userIntroduce || ""}
                render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    multiline
                    placeholder="자기소개를 해주세요."
                    maxRows={2}
                    rows={2}
                    error={error !== undefined}
                    helperText={error ? "글자 수를 초과했습니다." : ""}
                    onChange={(e) => {
                      field.onChange(e);
                      onChangeIntroduce(e.target.value);
                    }}
                />
                )}
            />
            </Stack>
            </Stack>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button type="submit">수정</Button>
            </Stack>
          </Stack>
          </form>
        </Modal>
      </Stack>
      </Grid>

      <Grid item>
        <Stack direction={"column"} spacing={"0.3rem"}>
        <Typography variant="h5" color="secondary.dark">자기소개</Typography>
        <Typography variant="h5" mt={"1rem"}>{props.introduce}</Typography>
        </Stack>
      </Grid>
      <Grid item>
          <Typography variant="h5" color="secondary.dark" mb={"0.4rem"}>관심기술</Typography>
          {props.skills?.map((stack) => {
            const skills = skillData.find((skill) => skill.name === stack);
            const color = skills?.type === "language" ? "default" : "success";
            return (
              <Chip avatar={<Avatar src={skills?.logo} />} label={stack} variant="outlined" color={color} sx={{ mr: "1rem", mb: "0.8rem" }} />
            )
          })}
      </Grid>
      </Grid>
    </Paper>
  );
};

const editUserinfoModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #B5CC6C',
  boxShadow: 20,
  p: "4rem",
  borderRadius: 6,
};
