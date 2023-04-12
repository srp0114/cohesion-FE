import React from "react";
import { Box, Typography } from "@mui/material"
import UserIcon from '@mui/icons-material/AccountCircleOutlined';

interface Proptypes {
    nickname?: string
}

const LeftSidebar = ({nickname}: Proptypes) => {
    return (
        <>
        <Box
            sx={{
            display: "flex",
            justifyContent: "flex-start",
            }}
        >
            <UserIcon fontSize="large" sx={{p:0, m:0}}/>
            {/* 서버로부터 받아올 이름 - 여기에 작업해주시면 됩니다! */}
            <Typography variant="subtitle1" sx={{p:0.5}}>
                {
                    nickname ? `${nickname} 님` : null
                }
            </Typography>
        </Box>
        <Box>
        <Box sx={{
            p:0.5,
            pl:2,
            mt:2,
            backgroundColor: 'secondary.main',
            borderRadius: 7,
            '&:hover': {
            backgroundColor: 'secondary.main',
            opacity: [0.9, 0.8, 0.7],
            },
            }}>
            <Typography variant="subtitle1">오늘 공부 한 줄</Typography>
            <Box sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                backgroundColor: 'prinary.main',
                opacity: [0.9, 0.8, 0.7],
                },
            }}/>
        </Box>

        </Box>
        </>
    );
  }
  
  export default LeftSidebar;