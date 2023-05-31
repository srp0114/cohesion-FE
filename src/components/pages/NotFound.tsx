import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, Typography, Stack } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      navigate(location.state?.from || "/");
    }, countdown * 1000);

    const timer = setInterval(() => {
      setCountdown((prevState) => prevState - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      clearInterval(timer);
    };
  }, [navigate, location, countdown]);

  return (
    <Stack spacing={"1rem"} sx={{ display: "flex", justifyContent: "center", flexDirection: "column", p:"1.5rem"}}>
        <Typography variant="h1" sx={{fontWeight: 400}}>404 NOT FOUND</Typography>
        <Divider variant="fullWidth" sx={{bgcolor:"primary.dark", borderBottomWidth: "0.5rem" }}/>

        <Typography variant="h3">Oops! 잘못된 접근이에요!</Typography>
        <Typography variant="h2" sx={{fontWeight: 500}}>
          {`${countdown}초 후에 메인 페이지로 돌아갑니다.`}
        </Typography>
    </Stack>
  );
};

export default NotFound;
