import { Typography } from "@mui/material";

export function replyCount(reply: number) {
  return (
      <Typography variant="h4" ml={"0.2rem"} mb={"1rem"}>{reply === 0 ? 
        "아직 댓글이 없습니다." : 
        `${reply}개의 댓글이 있습니다.`}
      </Typography>
  )
}