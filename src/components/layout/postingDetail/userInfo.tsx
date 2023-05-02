
import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import Profile from "../Profile";

export function userInfo(writer: string, stuId: number, imgUrl?: string) {
  const studentId = stuId.toString().slice(0,2);

  console.log(imgUrl)
  const profile = imgUrl === undefined ? (
    <Profile nickname={writer} size={30} />
  ) : (<Avatar
      srcSet={imgUrl}
      sx={{
        width: "2rem",
        height: "2rem",
      }} />);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}
    > 
      {profile}
      <Typography variant="h5">{`${writer} (${studentId}학번)`}</Typography>
    </Stack>
  )
}
