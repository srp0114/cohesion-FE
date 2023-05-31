import React, { useState } from "react";
import { Snackbar, SnackbarOrigin, Alert, AlertColor } from "@mui/material";

export interface State extends SnackbarOrigin {
    open: boolean;
}

interface AlertSnackbarProps {
    callNode: "dummy" | "신청취소" | "신청하기" | "승인허가" | "승인취소" | "모집완료" | "승인대기중" | "승인완료";
    snackbarState: State;
}

const callSource: string[] = [
    "dummy",
    "신청취소",
    "신청하기",

    "승인허가",
    "승인취소",

    "모집완료",

    "승인대기중",
    "승인완료",
];

const AlertSnackbar = (props: AlertSnackbarProps) => {
    const [state, setState] = useState<State>({
        open: props.snackbarState.open,
        vertical: props.snackbarState.vertical,
        horizontal: props.snackbarState.horizontal,
    });
    const { vertical, horizontal, open } = state;

    /* 출력될 메시지와, 메시지 성격에 따른 색깔 정의 */
    const messageNcolor: { message: string; color: AlertColor }[] = [
        { message: "오류 발생!", color: "error" },

        { message: "신청이 취소되었습니다.", color: "error" },
        { message: "신청이 완료되었습니다.", color: "success" },

        { message: "승인되었습니다.", color: "success" },
        { message: "승인 취소되었습니다.", color: "error" },

        /* 모집완료 버튼을 누르거나, 인원이 차서 모집완료가 되거나, 모집 완료된 게시글에 들어간 경우 */
        { message: "모집 완료되었습니다.", color: "info" },

        { message: "아직 승인대기 상태입니다.", color: "info" },
        { message: "승인이 완료된 상태입니다.", color: "info" },
    ]

    /**
     * props로 받은 callNode를 통해 Snackbar에 출력할 메시지를 지정합니다.
     */
    const designateMessage = (callNode: string) => {
        //callNode가 callSource의 몇 번째 요소인가?
        const callNodeIndex: number = callSource.findIndex(element => callNode === element) || 0;
    
        //위에서 받은 인덱스 번호로 messageNcolor에서 같은 번호의 객체 찾아서 message와 color 상태 지정
        const message: string = messageNcolor[callNodeIndex].message;
        console.log(`${callNodeIndex} 으갸갸갹갸`);
        return message;
    }

/**
 * props로 받은 callNode를 통해 Snackbar에 출력할 색깔을 지정합니다.
 */
    const designateColor = (callNode: string) => {
        //callNode가 callSource의 몇 번째 요소인가?
        const callNodeIndex: number = callSource.findIndex(element => callNode === element) || 0;

        //위에서 받은 인덱스 번호로 messageNcolor에서 같은 번호의 객체 찾아서 message와 color 상태 지정
        const color:AlertColor = messageNcolor[callNodeIndex].color;
        console.log(`오라라라라라ㅏ${color}`);
        return color;
    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={2000}
                open={props.snackbarState.open}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} color={designateColor(props.callNode)}>
                {designateMessage(props.callNode)}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AlertSnackbar;