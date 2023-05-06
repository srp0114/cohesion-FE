import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Chip, Collapse, Drawer, Divider, Grid, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, ListSubheader, Modal, Tooltip } from "@mui/material"
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from "axios";
import Point from "../../../layout/Point";
import { skillData } from "../../../data/SkillData";
import { Track } from "../../../model/user";

const dummy: Applicant[] = [
    {
        postingId: 23,
        isApproved: false,
        isMeetRequired: true,
        isMeetOptional: false,
        id: 2, //유저의 아이디
        studentId: 2271123,  //유저의 학번
        profileImg: "",
        nickname: "커스터드푸딩",
        skills: [skillData[0],skillData[3]],
        introduce: "푸딩쫀맛",
        track1: Track.bigData,
        track2: Track.mobile,
    },
    {
        postingId: 23,
        isApproved: false,
        isMeetRequired: true,
        isMeetOptional: false,
        id: 2, //유저의 아이디
        studentId: 2271123,  //유저의 학번
        profileImg: "",
        nickname: "커스터드푸딩",
        skills: [skillData[3]],
        introduce: "푸딩쫀맛",
        track1: Track.bigData,
        track2: Track.mobile,
    }, {
        postingId: 23,
        isApproved: false,
        isMeetRequired: true,
        isMeetOptional: false,
        id: 2, //유저의 아이디
        studentId: 2271123,  //유저의 학번
        profileImg: "",
        nickname: "커스터드푸딩",
        skills: [skillData[1],skillData[2]],
        introduce: "푸딩쫀맛",
        track1: Track.bigData,
        track2: Track.mobile,
    },
];


export interface Applicant { //얘가 결국에는 신청자 목록에 들어가야하고, 곧 파티원의 정보가 된다. //필요 없는 부분 삭제 필요
    postingId: number;

    isApproved: boolean;
    isMeetRequired?: boolean;
    isMeetOptional?: boolean;

    id: number; //유저의 아이디
    studentId: number; //유저의 학번
    profileImg: string;
    nickname: string;
    skills?: typeof skillData; //skillData[]
    introduce: string;
    track1: string;
    track2: string;
}

/**
 * 확인 or 취소겠죠 버튼 누른 사람의 학번,
 */

interface DoubleCheckModalProps {
    who: boolean; //접속한 유저가 작성자인지 신청자인지
    callNode: string; //모달을 부른 곳이 어디인지
    isComplete?: boolean;
    open: boolean;
    applicant: Applicant;
}
export const DoubleCheckModal = (props: DoubleCheckModalProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(props.open);
    const operators = [
        { who: false, callNode: "applyBtn" },
        { who: true, callNode: "approveBtn" },
        { who: true, callNode: "rejectBtn" },
        { who: true, callNode: "completeBtn" }
    ];

    const sentences = [
        "신청하시겠습니까? (신청이 완료된 후, 취소는 불가합니다.)",
        "승인하시겠습니까?", // 사라질수도...
        "승인을 취소하시겠습니까?", // 사라질수도...
        "모집을 완료하시겠습니까?"
    ]

    const designateOperator = (who: boolean, callNode: "applyBtn" | "approveBtn" | "rejectBtn" | "completeBtn" | string) => {
        const operatorArray = [...operators];
        const foundOperator = operatorArray.find((element) => props.who === element.who && props.callNode === element.callNode);
        if (foundOperator) {
            return operatorArray.indexOf(foundOperator);
        } else {
            return -1;
        }
    }

    const designateSentence = () => {
        const sentenceArray = Object.values(sentences);
        return sentenceArray[designateOperator(props.who, props.callNode)];
    }

    /**
     * 신청정보 서버로 전송
     */
    const postApplicantInfo = () => {
        axios({
            method: "post",
            url: `/api/recruit/${props.applicant.postingId}/application`
        }).catch((res) => {
            if (res.status === 200)
                console.log(`${res.data} ${JSON.stringify(res.data)}`);
        }).then((err) => {
            console.log(err);
        });
    }

    /**
     * 승인 혹은 승인취소(거절) 정보를 서버로 전송
     */
    const putApprove = () => {
        axios({
            method: "put",
            url: `/api/recruit/${props.applicant.postingId}/approval/${props.applicant.id}`,
        }).catch((res) => {
            if (res.status === 200)
                console.log(`$${res.data} ${JSON.stringify(res.data)}`);
        }).then((err) => {
            console.log(err);
        });
    }

    /**
     * 승인취소(거절) 정보를 서버로 전송
     */
    const putReject = () => {
        // axios({
        //     method: "put",
        //     url: `/api/recruit/${props.applicant.postingId}/approval/${props.applicant.id}`,
        // }).catch((res) => {
        //     if (res.status === 200)
        //         console.log(`$${res.data} ${JSON.stringify(res.data)}`);
        // }).then((err) => {
        //     console.log(err);
        // });
    }

    /**
     *  모집이 완료 or 취소되었다는 걸 서버로 전송
     */
    const putRecruitComplete = () => {
        // useEffect(() => {
        //     axios({
        //         method: "put",
        //         url: `/api/recruit/${props.applicant.postingId}/application`
        //     }).catch((res) => {
        //         if (res.status === 200)
        //             console.log(`${res.data} ${JSON.stringify(res.data)}`);
        //     }).then((err) => {
        //         console.log(err);
        //     });
        // }, []);
    }

    const confirmClickHandler = (operator: number) => { //확인 버튼 눌렀을 때,
        switch (operator) {
            case 0:
                postApplicantInfo(); //신청정보서버로
                break;
            case 1:
                putApprove(); //승인정보서버로
                break;
            case 2:
                putReject(); //승인취소정보서버로
                break;
            case 3:
                putRecruitComplete(); //모집완료정보서버로
                break;

        }
        setModalOpen(false);
    }

    const modalCloseHandler = () => { //취소버튼 클릭 혹은 배경의 백드롭클릭 시
        setModalOpen(false);
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={modalCloseHandler}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={doubleCheckModalstyle}>
                    <Typography align="center" variant="h5" sx={{ mt: 2 }}>
                        {designateSentence()}
                    </Typography>
                    { }
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Button onClick={() => confirmClickHandler(Number(designateOperator(props.who, props.callNode)))}>
                            Confirm
                        </Button>
                        <Button onClick={modalCloseHandler}>
                            Cancel
                        </Button>
                    </Stack>
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

export const ApplicantList = (applicants: Applicant) => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [collapseOpen, setCollapseOpen] = React.useState(false);

    //더미 데이터로 테스트
    const applications: Applicant[] = Array.from(new Set(Array.from(dummy)));//Array.from(new Set(Array.from(applicants)));
    console.log(`application form: ${JSON.stringify(applicants)}  ${typeof applicants}`);

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

    return (
        <div>
            {(["right"] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Tooltip title="신청자 목록">
                        <Button
                            startIcon={<FolderSharedOutlinedIcon />}
                            onClick={toggleDrawer(anchor, true)}
                        />
                    </Tooltip>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <Box sx={{ width: 250 }} role="presentation"
                            onClick={toggleDrawer(anchor, false)}
                            onKeyDown={toggleDrawer(anchor, false)}
                        >

                            <List dense={dense}>
                                <ListSubheader>
                                    신청자 목록
                                </ListSubheader>
                                {applications.map((app) => (
                                    <ListItem key={app.id}>
                                        <ListItemAvatar><Avatar src={app.profileImg} variant="rounded" /></ListItemAvatar>

                                        <ListItemText primary={app.nickname} secondary={`학번: ${app.studentId.toString().slice(0, 2)}`} />
                                        <ListItemText primary={app.isMeetRequired ? <Chip size="small" variant="outlined" label="👌" /> : <Chip size="small" variant="outlined" label="❌" />} secondary={(typeof app.isMeetOptional !== undefined && app.isMeetOptional === true) ? <Chip size="small" variant="outlined" label="👌" /> : <Chip size="small" variant="outlined" label="❌" />} />
                                        <ListItemButton>{collapseOpen ? <ExpandLess /> : <ExpandMore />}</ListItemButton>
                                        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                                            {/* 신청자 정보 */}
                                            {/* 1트랙, 2트랙 */}
                                            <Typography>{app.track1}</Typography>
                                            <Typography>{app.track2}</Typography>
                                            {/* 선택한 기술 */}
                                            {/*<Box>{app.skills}</Box>*/}
                                            {/* 자기소개 */}
                                            <Typography>{app.introduce}</Typography>
                                        </Collapse>

                                        <ListItemButton>
                                            {!(app.isApproved) ? <>
                                                <IconButton edge="end" aria-label="approve" onClick={() => setModalOpen(true)} >
                                                    <PersonAddOutlinedIcon />
                                                </IconButton>
                                                <DoubleCheckModal who={true} callNode="approveBtn" open={modalOpen} applicant={app} /></>
                                                : <><IconButton edge="end" aria-label="reject" onClick={() => setModalOpen(true)} >
                                                    <PersonAddDisabledOutlinedIcon />
                                                </IconButton>
                                                    <DoubleCheckModal who={true} callNode="rejectBtn" open={modalOpen} applicant={app} /></>}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>

                        </Box>
                    </Drawer>
                </React.Fragment >
            ))
            }
        </div >
    );
}


