import { Typography, Box, Stack } from "@mui/material";
import Time from "../Time";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import CircleIcon from '@mui/icons-material/Circle';

const TimeAndViews = (createdDate: string, views: number) => {
    return (
        <>
            <CircleIcon sx={{fontSize:"0.15rem", color:"primary.dark"}}/>
            <Time date={createdDate} variant="h5" />
            <CircleIcon sx={{fontSize:"0.15rem", color:"primary.dark"}}/>
            <Stack direction="row" spacing={0.5} sx={{ disply:"flex", alignItems:"center"}}>
                <Visibility sx={{fontSize:"1.3rem"}}/>
                <Typography variant="h5">{views}</Typography>
            </Stack>
        </>
    )
}

export default TimeAndViews;