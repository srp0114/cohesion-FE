import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Button, IconButton, Typography, Stack, Paper } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import MySummaryField from "./MySummaryField";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditOutlined';

export interface MySummaryItems { //유저가 작성한 공부기록들 중 가장 최신 글을 가지고와야한다.
  summaryId: number; //공부내용 요약 고유 id
  date: string; //가장 최신 공부기록의 날짜
  content: string; //공부기록내용
}

const testSummary : MySummaryItems[] = [
  {
    summaryId: 1,
    date: "1분전",
    content: "타입스크립트 정리"
  },
  {
    summaryId: 2,
    date: "어제",
    content: "스프링"
  },
  {
    summaryId: 3,
    date: "지난주",
    content: "가나다라마바사아자차카타파하"
  },
]

const MySummary = () => {
  const [summary, setSummary] = useState<MySummaryItems[]>(testSummary);

  useEffect (()=>{
      axios({
          method : "get",
          url : `/api/user/summary/mypage`
      }).then((res)=>{
          if(res.status === 200)
            console.log(res.data);
      }).catch((err)=>{
          console.log(err);
      })
  }, [summary]);

  const onAddSummary = (content: string) => {
    const data = {
      content: content,
    };
    axios({
      method: "post",
      url: `/api/user/summary/mypage`,
      headers: { "Content-Type": "application/json" },
      data: data,
    })
    .then((res) => {
      if (res.status === 200) {
          console.log(res.data);
          const newSummary = res.data;
          setSummary([...summary, newSummary]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    console.log(data);
  }

  const onDeleteSummary = (id:number) => {
    axios({
        method : "delete",
        url : `api/user/${id}/summary/mypage`
    }).then((res)=>{
        console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    })
  }

  const onEditSummary = (id:number, content:string) => {
    const data = {
      content: content,
    };
    axios({
      method: "put",
      url: `/api/user/${id}/summary/mypage`,
      headers: { "Content-Type": "application/json" },
      data: data,
    })
    .then((res) => {
      if (res.status === 200) {
          console.log(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

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
              p: "1.125rem",
            }}
            elevation={3}
          >
          <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center"}}>
            <Grid item>
            <Typography>{value.content}</Typography>
            </Grid>
            <Grid item>
              <IconButton>
                <EditIcon/>
              </IconButton>
              <IconButton onClick={()=>onDeleteSummary(value.summaryId)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
          
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1.125rem",
            }}
          >
            <Typography>{value.date}</Typography>

            <IconButton>
              <MoreHorizOutlinedIcon />
            </IconButton>
          </Stack>
        </Paper>
        </Grid>
          )
        })}
      </Grid>
    </>
  )
};

export default MySummary;