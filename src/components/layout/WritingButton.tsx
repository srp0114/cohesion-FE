import React from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// 작성하기 버튼
export const WritingButton = () => {
  const navigate = useNavigate();

  const goToWriting = () => {
    navigate("/post");
  };

  return (
    <Box sx={{ "& > :not(style)": { ml: 120 }, position: "fixed", bottom: "2.5rem", right:"10rem" }}>
      <Fab
        size="medium"
        color="primary"
        aria-label="edit"
        onClick={goToWriting}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
