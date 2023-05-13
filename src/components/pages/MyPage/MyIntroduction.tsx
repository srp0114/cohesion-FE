import React, { useState } from "react";
import { Button, Box, Chip, Grid, IconButton, Typography, Stack, Paper, Avatar, Modal } from "@mui/material";
import { skillData } from "../../data/SkillData";
import UserSkill from "../../layout/UserSkill";
import UserIntroduce from "../../layout/UserIntroduce";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

interface MyIntroductionProps {
  nickname: string;
  skills?: Array<string>;
  introduce: string;
  editUserInfo: (changeSkills:string[], changeIntroduce: string) => void
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userSkill, setUserSkill] = useState<string[]>(props.skills || []);
  const [userIntroduce, setUserIntroduce] = useState<string>(props.introduce);

  const onChangeSkills = (changeSkills: string[]) => {
    setUserSkill(changeSkills);
  }

  const onChangeIntroduce = (changeIntroduce: string) => {
    setUserIntroduce(changeIntroduce);
  }

  const editMyIntroduce = () => {
    setOpen(false);
    props.editUserInfo(userSkill, userIntroduce);
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
        <IconButton  onClick={()=>setOpen(true)}>
          <CreateOutlinedIcon/>
        </IconButton>

        <Modal open={open}>
          <Stack sx={editUserinfoModal} direction={"column"} spacing={5}>
            <Typography variant="h1" align="center">내 정보 수정</Typography>
            <Box>
              <Typography variant="h5" pb={"0.6rem"}>관심기술을 선택해주세요!</Typography>
              <UserSkill skills={props.skills} changeSkills={onChangeSkills}/>
            </Box>
            <Box pt={"1rem"}>
            <UserIntroduce introduce={props.introduce} changeIntroduce={onChangeIntroduce}/>
            </Box>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <Button onClick={()=>setOpen(false)}>취소</Button>
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
                <Chip avatar={<Avatar src={skills?.logo} />} label={stack} variant="outlined" color={color} sx={{mr: "1rem", mb: "0.8rem"}}/>
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