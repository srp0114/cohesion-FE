import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stack, Grid, Chip, Snackbar, Alert, Typography, Avatar, Paper, ListItemIcon, Menu, MenuItem } from "@mui/material";
import MySummaryField from "./MySummaryField";
import MySummaryEditField from "./MySummaryEditField";
import Time from "../../layout/Time";
import { skillData } from "../../data/SkillData";
import MySummaryFixed from "./MySummaryFixed";
import MySummaryMenu from "./MySummaryMenu";
import PushPinIcon from '@mui/icons-material/PushPin';
import { State } from "../../layout/Bookmark";

export interface MySummaryItems {
  summaryId: number;
  date: string;
  content: string;
  language: string; 
  isFixed: boolean; 
}

const MySummary = () => {
  const [summary, setSummary] = useState<MySummaryItems[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSummaryId, setEditSummaryId] = useState<number>(0);
  const [fixedSummary, setFixedSummary] = useState<MySummaryItems[]>([]);
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;
  const [message, setMessage] = useState<string>("");
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const getSummary = async () => {
    try {
      const res = await axios.get(`/api/user/summary/mypage`);
      if (res.status === 200) {
        setSummary(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getFixedSummary = async () => {
    try {
      const res = await axios.get(`/api/user/summary/mypage/fixed`);
      if (res.status === 200) {
        setFixedSummary(res.data);
      }
    } catch (err) {
      console.log(err);
    }
   }

  useEffect (()=>{
    getSummary();
    getFixedSummary();
  }, []);

  const onAddSummary = (content: string, language?: string) => {
    const data = {
      content: content,
      language: language
    };

    axios({
      method: "post",
      url: `/api/user/summary/mypage`,
      headers: { "Content-Type": "application/json" },
      data: data,
    })
    .then((res) => {
      if (res.status === 200) {
        getSummary();
        setMessage("공부기록이 등록되었습니다.");
        setState({ ...state, open: true });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const onDeleteSummary = (id:number) => {
    axios({
        method : "delete",
        url : `api/user/${id}/summary/mypage`
    }).then((res)=>{
        getSummary();
        setMessage("공부기록을 삭제하였습니다.");
        setState({ ...state, open: true });  
    }).catch((err)=>{
        console.log(err);
    })
  }

  const onEditSummary = (id:number, content:string) => {
    const data = {
      content: content
    };

    axios({
      method: "put",
      url: `/api/user/${id}/summary/mypage`,
      headers: { "Content-Type": "application/json" },
      data: data,
    })
    .then((res) => {
      if (res.status === 200) {
        getSummary();
        setIsEditing(false);
        setMessage("공부기록을 수정하였습니다.");
        setState({ ...state, open: true }); 
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const onFixSummary = (id: number) => {
    axios({
      method: "put",
      url: `/api/user/${id}/summary/fix`,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      if (res.status === 200) {
        getSummary();
        getFixedSummary();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const onReleaseSummary = (id: number) => {
    axios({
      method: "put",
      url: `/api/user/${id}/summary/release`,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      if (res.status === 200) {
        getSummary();
        getFixedSummary();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <Grid container direction="column" xs={12} md={12} mt={1}>
      <MySummaryFixed fixedSummary={fixedSummary}/>
      <MySummaryField onAddSummary={onAddSummary}/>
      {summary.map((value) => {
        const selectedSkill = skillData.find((skill) => skill.name === value.language);
        const color = selectedSkill?.type === "language" ? "default" : "success";
        return (
          <>
          <Grid item p={1.5}>
            <Paper className="mySummaryPaper" elevation={3}>
              <Grid container direction="row" spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <Grid item>
                  <Stack direction="row" spacing={"1rem"} alignItems={"center"}>
                  {value.language === "" ? null : <Chip avatar={<Avatar src={selectedSkill?.logo} />} label={value.language} variant="outlined" color={color}/>}
                  <Typography variant="h5" color="primary.dark"><Time date={value.date} variant={"h5"}/></Typography>
                  {value.isFixed ? <PushPinIcon fontSize={"small"} sx={{ color:"secondary.dark" }} /> : null}
                  </Stack>
                </Grid>
                  {!isEditing ? 
                  <MySummaryMenu summaryId={value.summaryId} isFixed={value.isFixed} onDeleteSummary={onDeleteSummary}
                  onFixSummary={onFixSummary} onReleaseSummary={onReleaseSummary} setIsEditing={setIsEditing} setEditSummaryId={setEditSummaryId}/> : null
                  }
              </Grid>
              {isEditing && editSummaryId === value.summaryId ? 
                <MySummaryEditField summaryId={value.summaryId} content={value.content} editSummary={onEditSummary}/> : 
                <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center"}}>
              <Grid item m={"1rem"}>
                <Typography>{value.content}</Typography> 
              </Grid>
            </Grid>
              }
          </Paper>
        </Grid>
        </>
          )
        })}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={2000}
        open={open}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </>
  )
};

export default MySummary;