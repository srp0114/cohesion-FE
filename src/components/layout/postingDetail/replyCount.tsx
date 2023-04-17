import React from "react";
import { Grid, Typography } from "@mui/material";

export function replyCount(reply: number) {
  return <Grid item xs={12} sm={6}>
    <Typography variant="h5">{`${reply}개의 댓글이 있습니다.`}</Typography>
  </Grid>;
}
