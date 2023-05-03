import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Drawer, Divider, Grid, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Modal } from "@mui/material"
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
/**
 * 
 *'신청하기' 버튼 //게시글 작성자 제외한 모든 사용자에게서 보임.
 */

export const ApplyButton = () => {
    const [open, setOpen] = React.useState(false);
    const clickHandler = () => { //신청확인모달띄우기
        setOpen(true); //open이 false에서 true
        alert(`신청하기 버튼 clickHandler ${open}`);
    }
    return (
        <>
            <Button variant="outlined" startIcon={<HistoryEduOutlinedIcon />} size="small" onClick={clickHandler}>
                신청하기
            </Button>
            <DoubleCheckModal isWriter={false} callNode="applyBtn" open={open} onClose={() => setOpen(false)} />
        </>
    );
}

/**
 * '구인(모집)완료버튼' //게시글 작성자에게만 보임
 */
export const RecruitCompleteButton = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const clickHandler = () => { //신청확인모달띄우기
        alert(`모집완료 버튼 clickHandler ${open}`);
        setOpen(true);
    }
    return (
        <>
            <Button variant="outlined" startIcon={<AssignmentTurnedInIcon />} size="small" onClick={clickHandler}>
                모집완료
            </Button>
            <DoubleCheckModal isWriter={true} callNode="completeBtn" open={open} onClose={() => setOpen(false)} />
        </>
    );
}

/**
 * 확인 or 취소겠죠 버튼 누른 사람의 학번,
 */

interface DoubleCheckModalProps {
    isWriter: boolean; //작성자면 true, 일반 사용자면 false
    callNode: HTMLElement | string; //아마...이벤트타겟객체어쩌고이런거로...안되면 그냥 하나하나 만들어야지 뭐
    open: boolean;
    onClose: () => void;
}
export const DoubleCheckModal = (props: DoubleCheckModalProps) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const sentences = [
        { who: false, sentence: "신청하시겠습니까? (신청이 완료된 후, 취소는 불가합니다.)", source: "applyBtn" },
        { who: true, sentence: "승인하시겠습니까?", source: "applicantList" }, // 사라질수도...
        { who: true, sentence: "승인을 취소하시겠습니까?", source: "applicantList" }, // 사라질수도...
        { who: true, sentence: "모집을 완료하시겠습니까?", source: "completeBtn" },
    ];

    const designateAnnouncement = () => {
        const printingSentence = [...sentences].find((element) => (props.isWriter == element.who && props.callNode == element.source))?.sentence;
        console.log(`DoubleCheckModal의 designateAnnouncement 함수`);
        console.log(`출력될 문장 => ${JSON.stringify(printingSentence)} props.isWriter => ${props.isWriter} ${typeof props.isWriter}`);
        console.log(`props.callNode => ${JSON.stringify(props.callNode)} ${typeof props.callNode}`);
        return (printingSentence || 'error');
    }

    const clickHandler = () => { //확인 버튼 눌렀을 때,
        //신청이면 신청 인원 + 1
        //모집완료면 게시글 disabled
        //승인이면...모인인원 + 1
        setOpen(false);
        alert(`모달 clickHandler 확인 버튼 누름`);
        props.onClose();
    }

    // const handleClose = () => setOpen(false);

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.onClose}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={doubleCheckModalstyle}>
                    <Typography align="center" variant="h5" sx={{ mt: 2 }}>
                        테스트입니다.
                        {designateAnnouncement()}
                    </Typography>
                    <Button onClick={clickHandler}>
                        네
                    </Button>
                </Box>

            </Modal>
        </>
    );
}

const doubleCheckModalstyle = { //Home.tsx의 loginModalstyle에서 가져옴
    borderRadius: 5,
    p: 4,
    bgcolor: 'background.paper',
    boxShadow: 20,
};

/**
 * 게시글 작성자: 신청자들의 목록 전체를 볼 수 있음, 프로필을 눌러 마이페이지에 접근가능, 마이페이지는 반갈죽해서 보이면 좋겠당...그 drawer로...가능한가?
 *신청자 리스트 //신청을 완료 (더블체킹까지 완료한 신청자들의 목록)
 */
type Anchor = 'top' | 'left' | 'bottom' | 'right';

export const ApplicantList = () => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);

    function generate(element: React.ReactElement) {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }


    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List dense={dense}>
                {generate(
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="approve" onClick={() => alert("승인되었습니다.")}>
                                <PersonAddOutlinedIcon />
                            </IconButton>
                        }

                    /* 추후 secondaryAction 해당 유저 상태에 따라 바뀔 수 있게끔...<IconButton edge="end" aria-label="reject">
                    <PersonAddDisabledOutlinedIcon />
                    </IconButton>*/
                    >
                        <ListItemAvatar>
                            <Avatar>
                                {/*사용자 프로필(?) */}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Single-line item"
                            secondary={secondary ? 'Secondary text' : null}
                        />
                    </ListItem>,
                )}
            </List>
        </Box>
    );

    return (
        <div>
            {(['right'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button startIcon={<SportsKabaddiIcon />} onClick={toggleDrawer(anchor, true)}>신청자 목록</Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}



