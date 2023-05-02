import React from "react";
import {
  Avatar, Stack,
  Typography
} from "@mui/material";

export function userInfo(writer: string, imgUrl: string, stuId: number) {
  const studentId = stuId.toString();
  return <Stack
    direction="row"
    sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}
  >
    <Avatar
      srcSet={imgUrl}
      sx={{
        width: "3rem",
        height: "3rem",
        marginRight: "0.75rem", //12px
      }} />
    <Typography variant="h5">
      {`${writer} (${studentId.slice(0,2)}학번)`}
    </Typography>
  </Stack>;
}
