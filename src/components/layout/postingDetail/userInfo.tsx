import React from "react";
import {
  Avatar, Stack,
  Typography
} from "@mui/material";

export function userInfo(writer: string, imgUrl: string, stuId: number) {
  return <Stack
    direction="row"
    sx={{ display: "flex", justifyContent: "start" }}
  >
    <Avatar
      srcSet={imgUrl}
      sx={{
        width: "3rem",
        height: "3rem",
        marginRight: "0.75rem", //12px
      }} />
    <Typography variant="h6" textAlign={"center"}>
      {`${writer} (${Math.floor(stuId/100000)}학번)`}
    </Typography>
  </Stack>;
}
