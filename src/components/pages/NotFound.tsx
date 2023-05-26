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
    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
      <Box>
        <Typography variant="h1">404 NOT FOUND</Typography>
        <Divider variant="fullWidth" />
      </Box>

      <Stack>
        <Typography variant="h3">Oops! 잘못된 접근이에요!</Typography>
        <Typography variant="h2">
          {`${countdown}초 후에 메인 페이지로 돌아갑니다.`}
        </Typography>
      </Stack>
    </Box>
  );
};

export default NotFound;
