import { Stack, Grid, Chip, Typography, Avatar, Paper, } from "@mui/material";
import { MySummaryItems } from "./MySummary";
import { skillData } from "../../data/SkillData";
import Time from "../../layout/Time";

interface MySummaryFixedProps {
  fixedSummary: MySummaryItems[]
}

const MySummaryFixed = (props :MySummaryFixedProps) => {

    return (
        <>
        {props.fixedSummary.map((value) => {

        const selectedSkill = skillData.find((skill) => skill.name === value.language);
        const color = selectedSkill?.type === "language" ? "default" : "success";

        return (
          <Grid item p={1.5}>
          <Paper className="mySummaryFixedPaper" elevation={3}>
            <Grid container direction="row" spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <Grid item>
                  <Stack direction="row" spacing={"1rem"} alignItems={"center"}>
                  {value.language === "" ? null 
                    : <Chip avatar={<Avatar src={selectedSkill?.logo} />} label={value.language} variant="outlined" color={color}/>
                  }
                  <Typography variant="h5" color="primary.dark"><Time date={value.date} variant={"h5"}/></Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={2} sx={{justifyContent:"space-between", alignItems:"center"}}>
              <Grid item ml={"0.8rem"} mt={"0.8rem"}>
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