
import { Stack, Typography } from "@mui/material";
import Profile from "../Profile";

export function userInfo(writer: string, stuId: number, imgUrl: string | null) {
  const studentId = stuId.toString().slice(0,2);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}
    > 
      <Profile nickname={writer} imgUrl={imgUrl} size={30} />
      <Typography variant="h5">{`${writer} (${studentId}학번)`}</Typography>
    </Stack>
  )
}
