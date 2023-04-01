import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const Footer = () => (
  <Box sx={{ backgroundColor: "#787878", width: "auto", marginTop: "5%" }}>
    <Typography sx={{ color: "white" }}>Copyright @ 2023 COHESION</Typography>
    <Stack direction="row" spacing={4}>
      <Typography sx={{ color: "white" }}>컴퓨터공학부</Typography>
      <Typography sx={{ color: "white" }}>한성대홈페이지</Typography>
      <Typography sx={{ color: "white" }}>개인정보 처리방침</Typography>
    </Stack>
  </Box>
);

export default Footer;