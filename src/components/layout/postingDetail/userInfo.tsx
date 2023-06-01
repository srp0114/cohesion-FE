import { Stack, Chip, Typography, Tooltip, IconButton } from "@mui/material";
import Profile from "../Profile";

export function userInfo(writer: string, stuId: number, imgUrl: string | null, introduce: string) {
  const studentId = stuId.toString().slice(0, 2);

  const userProfile = (
    <IconButton>
      <Profile nickname={writer} imgUrl={imgUrl} size={30} />
    </IconButton>
  );

  const profileWithIntro = introduce === "" ? (
    userProfile
  ) : (
    <Tooltip title={introduce}>{userProfile}</Tooltip>
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
    >
      {profileWithIntro}
      <Typography variant="h5">{`${writer}`}</Typography>
      <Chip
        variant="outlined"
        label={`${studentId}학번`}
        size="small"
        style={{ color: "#000000" }}
      />
    </Stack>
  );
}
