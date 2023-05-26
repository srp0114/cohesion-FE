import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      navigate(location.state?.from || "/");
    }, 5000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [navigate]);

  return (
    <Box>
      <Box>
        <Typography variant="h6">404 NOT FOUND</Typography>
        <Typography variant="body1">Oops! 잘못된 접근이에요!</Typography>
        <Typography variant="body1">
          5초 후에 이전에 있던 페이지로 돌아갑니다.
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFound;
