import React from "react";
import {
    Typography
} from "@mui/material";

interface timeForToday {
    date: string;
}

const Time: React.FC<timeForToday> = ( props : timeForToday ) => {
    const today = new Date();
    const timeValue = new Date(props.date);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    const betweenTimeHour = Math.floor(betweenTime / 60);
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    const betweenTimeYear = Math.floor(betweenTimeDay/365);

    if (betweenTime < 1) 
        return (
            <Typography>방금전</Typography>
        );

    else if (betweenTime < 60) {
        return (
            <Typography>{betweenTime}분전</Typography>
        )
    }

    else if (betweenTimeHour < 24) {
        return (
            <Typography>{betweenTimeHour}시간전</Typography>
        )
    }

    else if (betweenTimeDay < 365) {
        return (
            <Typography>{betweenTimeDay}일전</Typography>
        )
    }

    else {
        return (
            <Typography>{betweenTimeYear}년전</Typography>
        );
    }
}

export default Time;