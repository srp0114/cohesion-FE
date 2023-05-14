import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Chip, IconButton, Typography, Avatar, Paper, Button} from "@mui/material";
import { MySummaryItems } from "./MySummary";
import { skillData } from "../../data/SkillData";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Time from "../../layout/Time";
const MySummaryFixed = () => {
    const [fixedSummary, setFixedSummary] = useState<MySummaryItems[]>([]);

    useEffect (()=>{
        axios({
            method : "get",
            url : `/api/user/summary/mypage/fixed`
        }).then((res)=>{
            if(res.status === 200)
                setFixedSummary(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }, []);

    return (
        <>
        {fixedSummary.map((value) => {

        const selectedSkill = skillData.find((skill) => skill.name === value.language);
        const color = selectedSkill?.type === "language" ? "default" : "success";

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
              <Grid item>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                  <Typography variant="h5" color="primary.dark"><Time date={value.date} variant={"h5"}/></Typography>
                  { value.language === "" ? null 
                    : <Chip sx={{ marginLeft: '0.5rem' }} avatar={<Avatar src={selectedSkill?.logo} />} label={value.language} variant="outlined" color={color}/>
                  }
                </Box>
              </Grid>
              <Grid item>
                <IconButton><MoreHorizOutlinedIcon /></IconButton>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center", pl:"0.8rem"}}>
              <Grid item>
                <Typography>{value.content}</Typography> 
              </Grid>
            </Grid>
        </Paper>
        </Grid>
          )
        })}
        </>
    )
}

export default MySummaryFixed;