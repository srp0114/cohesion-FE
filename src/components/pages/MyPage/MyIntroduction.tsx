import React, { useState, useEffect } from "react";
import { Button, Box, Chip, Grid, IconButton, Typography, Stack, Paper, Avatar, Modal, TextField } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { skillData } from "../../data/SkillData";
import UserSkill from "../../layout/UserSkill";
import UserIntroduce from "../../layout/UserIntroduce";
interface MyIntroductionProps {
  nickname: string;
  skill?: Array<string>;
  selfIntroduction: string;
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userSkill, setUserSkill] = useState<string[]>(props.skill || []);
  const [introduce, setIntroduce] = useState<string>(props.selfIntroduction);

  const onChangeSkills = (userSkill: string[]) => {
    setUserSkill(userSkill);
  }

  const onChangeIntroduce = (selfIntro: string) => {
    setIntroduce(selfIntro);
  }

  const changeUserInfo = () => {
    setOpen(true);
  }

  return (
    <Paper
      sx={{
        borderRadius: "15px",
        padding: "1.125rem",
      }}
        elevation={3}
    >
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>{`Hello, ${props.nickname}!`}</Typography>
        <IconButton  onClick={changeUserInfo}>
          <CreateOutlinedIcon/>
        </IconButton>
          <Modal
            open={open}
          >
          <Box sx={editUserinfoModal}>
            <Typography variant="h3">회원정보 수정</Typography>
            <UserSkill skills={props.skill} setSkills={onChangeSkills}/>
            <UserIntroduce introduce={props.selfIntroduction} setIntroduce={onChangeIntroduce}/>
            <Button onClick={()=>setOpen(false)}>취소</Button>
          </Box>
          </Modal>
      </Stack>

      <Grid container rowSpacing={"1.125rem"} direction="column">
        <Grid item>
          <Box>
            {props.skill?.map((stack) => {
              const skills = skillData.find((skill) => skill.name === stack);
              const color = skills?.type === "language" ? "default" : "success";
              return (
                <Chip avatar={<Avatar src={skills?.logo} />} label={stack} variant="outlined" color={color} sx={{mr: "1rem"}}/>
              )
            })}
          </Box>
        </Grid>

        <Grid item>
          <Typography>{props.selfIntroduction}</Typography>
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
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 20,
  p: 4,
};
