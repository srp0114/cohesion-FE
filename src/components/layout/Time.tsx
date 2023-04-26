import React from "react";
import {
    Typography
} from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";

interface timeForToday {
    date: string;
    variant?: TypographyProps['variant'];
}

const Time: React.FC<timeForToday> = ( props : timeForToday ) => {
    const today = new Date();
    const timeValue = new Date(props.date);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    const betweenTimeHour = Math.floor(betweenTime / 60);
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    const betweenTimeYear = Math.floor(betweenTimeDay/365);

    const variant = props.variant;

    if (betweenTime < 1) 
        return (
            <Typography variant={variant}>방금전</Typography>
        );

        
    else if (betweenTime < 60) {
        return (
            <Typography variant={variant}>{betweenTime}분전</Typography>
        )
    }

    else if (betweenTimeHour < 24) {
        return (
            <Typography variant={variant}>{betweenTimeHour}시간전</Typography>
        )
    }

    else if (betweenTimeDay < 365) {
        return (
            <Typography variant={variant}>{betweenTimeDay}일전</Typography>
        )
    }

    else {
        return (
            <Typography variant={variant}>{betweenTimeYear}년전</Typography>
        );
    }
}

export default Time;