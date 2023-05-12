import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Button, IconButton, Typography, Stack, Paper } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import MySummaryField from "./MySummaryField";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditOutlined';
import MySummaryEditField from "./MySummaryEditField";
import Time from "../../layout/Time";

export interface MySummaryItems {
  summaryId: number;
  date: string;
  content: string;
  //skills: Array<string>; //사용자가 작성시, 선택한 기술스택
  //fixed: boolean; //사용자가 고정하고 싶은 공부기록
}

const MySummary = () => {
  const [summary, setSummary] = useState<MySummaryItems[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSummaryId, setEditSummaryId] = useState<number>(0);

  useEffect (()=>{
      axios({
          method : "get",
          url : `/api/user/summary/mypage`
      }).then((res)=>{
        if(res.status === 200)
          setSummary(res.data);
      }).catch((err)=>{
          console.log(err);
      })
  }, []);

  const onAddSummary = (content: string) => {
    const data = {
      content: content
    };

    axios({
      method: "post",
      url: `/api/user/summary/mypage`,
      headers: { "Content-Type": "application/json" },
      data: data,
    })
    .then((res) => {
      if (res.status === 200) {
        const newSummary = res.data;
        setSummary([...summary, newSummary]);
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
        setSummary(summary.filter((summary) => summary.summaryId !== id));
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
        const editedSummary = res.data;
        const newSummary = summary.map((value)=>{
            if(value.summaryId === id){
                return {...summary, ...editedSummary};
            }
            return value;
        });
        setSummary(newSummary);
        setIsEditing(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
 
  const editHandler = (id: number) => {
    setEditSummaryId(id);
    setIsEditing(true);
  };

  return (
    <>
      <Grid container direction="column" xs={12} md={12} mt={1}>
      <MySummaryField onAddSummary={onAddSummary}/>
      {summary.map((value) => {
        return (
          <Grid item p={1.5}>
          <Paper
            sx={{
              borderRadius: "15px",
              p: "1.2rem 1.5rem 1.7rem 1.7rem",
            }}
            elevation={3}
          >
            <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center", pl:"0.8rem"}}>
              <Grid item >
                <Typography variant="h5" color="primary.dark"><Time date={value.date} variant={"h5"}/></Typography>
              </Grid>
              <Grid item>
                <IconButton><MoreHorizOutlinedIcon /></IconButton>
              </Grid>
            </Grid>
            {editSummaryId === value.summaryId && isEditing ? 
            <>
            <MySummaryEditField summaryId={value.summaryId} content={value.content} editSummary={onEditSummary}/> 
            </> : 
            <>
            <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center", pl:"0.8rem"}}>
              <Grid item>
                <Typography>{value.content}</Typography> 
              </Grid>
              <Grid item>
                <IconButton>
                  <EditIcon onClick={()=>editHandler(value.summaryId)}/>
                </IconButton>
                <IconButton onClick={()=>onDeleteSummary(value.summaryId)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            </>
            }
        </Paper>
        </Grid>
          )
        })}
      </Grid>
    </>
  )
};

export default MySummary;