import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Drawer, Divider, Grid, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Modal } from "@mui/material"
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import axios from "axios";
import Point from "../../../layout/Point";
import { request } from "http";

const dummy:Applicant[] = [{
    postingId:25,

    isApproved: false,
    isMeetRequired: true,
   
    id: 2,
    studentId: 1971096,
    partyId: 5,
    name: "김이박",
    nickname: "닉네임",
    career: "커리어.....?",
    introduce: "말하는감자잉ㅂ니",
    track1: "웹공학",
    track2: "모바일소프트웨어"} ,
{
    postingId:25,

    isApproved: false,
    isMeetRequired: true,
   
    id: 4,
    studentId: 2091096,
    partyId: 7,
    name: "최권강",
    nickname: "왈왈왈왈!!!!",
    career: "커리어.....?",
    introduce: "말하는감자잉ㅂ니",
    track1: "빅데이터",
    track2: "모바일소프트웨어"}]

export interface Applicant { //얘가 결국에는 신청자 목록에 들어가야하고, 곧 파티원의 정보가 된다. //필요 없는 부분 삭제 필요
    postingId: number;

    isApproved: boolean;
    isMeetRequired: boolean;
    isMeetoptional?: boolean;

    id: number; //유저의 아이디
    studentId: number; //유저의 학번
    partyId: number; //파티원 아이디
    name: string;
    nickname: string;
    career: string;
    introduce: string;
    track1: string;
    track2: string;
}

/**
 * 
 *'신청하기' 버튼 //게시글 작성자 제외한 모든 사용자에게서 보임.
 */
interface ApplyButtonProps {
    postingId: number; //게시글 아이디

    id: number; //유저의 아이디
    studentId: number; //유저의 학번
    name: string;
    nickname: string;
    career: string;
    introduce: string;
    track1: string;
    track2: string;

    isMeetRequired: boolean,
    isMeetOptional: boolean,

    onPotentialPartyIdChange: (potentialPartyId: Array<number>) => void; //신청자 수 변경 관리 위함. api 필요, 추후 삭제 및 수정
    onApplicationInfoUpdate: (applicationInfo: Array<Applicant>) => void; //신청자 목록 관리 위함. api 필요, 추후 삭제 및 수정
}
export const ApplyButton = (props: ApplyButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const [potentialPartyId, setPotentialPartyId] = useState<Array<number>>([]);
    const [applicationInfo, setApplicationInfo] = useState<Array<Applicant>>([]);

    
    const clickHandler = () => { //신청확인모달띄우기
        setOpen(true);
    }

    const submittedApplication = () => { //신청 제출함. modal 창에서 확인버튼 누름
        const applicant_data = {
            //dummydata
            isMeetRequired: props.isMeetRequired,
            isMeetOptional: props.isMeetOptional,
        };
        setOpen(false); //모달 닫고

        axios({ //신청정보를 서버로 보낸다.
            method: "post",
            url: `/api/recruit/${props.postingId}/application`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(applicant_data)
        })
            .then((res) => {
                if (res.status === 200) {
                    const newApplicationInfo = {
                        isApproved: false, //default
                        partyId: res.data,
                        ...applicant_data,
                        ...props,
                    }
                    setPotentialPartyId((prevState) => [...prevState, res.data]);
                    setApplicationInfo((prevState) => [...prevState, newApplicationInfo]);
                    alert(`신청자 정보 ${potentialPartyId} ${applicationInfo}`); //1, 2, 3 ... 인덱스? 사람 수? 아이디?
                    props.onPotentialPartyIdChange([...potentialPartyId, res.data]);
                    props.onPotentialPartyIdChange([...potentialPartyId, res.data]);
                }
            })
            .catch((err) => { console.log(err); });
    }

    return (
        <>
            <Button variant="outlined" startIcon={<HistoryEduOutlinedIcon />} size="small" onClick={clickHandler}>
                신청하기
            </Button>
            <DoubleCheckModal isWriter={false} callNode="applyBtn" open={open} onClose={() => submittedApplication()} />
        </>
    );
}

/**
 * '구인(모집)완료버튼' //게시글 작성자에게만 보임
 */
export const RecruitCompleteButton = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const clickHandler = () => { //신청확인모달띄우기
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
        setOpen(false);
        //모집완료면 게시글 disabled
        //승인이면...모인인원 + 1
        props.onClose();
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.onClose}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={doubleCheckModalstyle}>
                    <Typography align="center" variant="h5" sx={{ mt: 2 }}>
                        {designateAnnouncement()}
                    </Typography>
                    {/* 여기 필수조건, 우대조건 띄우고, 체크박스로 true false 띄우고,우대조건 디폴트는 false. */}
                    <Button onClick={clickHandler}>
                        네, 확인했어요!
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

export const ApplicantList = (applicants: Applicant[], postingId:number, onGatheredPartyUpdate: (gatheredParty: number) => void) => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [gatheredParty, setGatheredParty] = useState<number>(0);
    const [writerId, setWriterId] = useState<number>(0);

    axios({
        method: "get",
        url: `/api/recruit/detail/${dummy[0].postingId}`, //${postingId}`, dummy 데이터로 테스트 중이기 때문에..
    }).then( (res) => {
        if(res.status === 200) {
            setGatheredParty(res.data.gathered);
            setWriterId(res.data.id);
        }
    }
    ).catch((err) => console.log(err));


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

    const approvedApplicant = (targetApplicant: Applicant) => { //승인된 신청자
        const request_approve = {
            boardId: targetApplicant.postingId,
            userId: writerId,
            targetUserId: targetApplicant.id
        }
        //신청 승인정보를 서버로 보내기
        axios({
            method: "put",
            url: `/api/recruit/${targetApplicant.postingId}/approval/${targetApplicant.id}`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_approve),
        })
            .then((res) => {
                if (res.status === 200) {
                    setGatheredParty(Number(gatheredParty+1));
                    onGatheredPartyUpdate(gatheredParty);
                    alert(`승인되었습니다. ${targetApplicant.isApproved} Hello, ${targetApplicant.nickname}!`);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div>
            {(["right"] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        startIcon={<SportsKabaddiIcon />}
                        onClick={toggleDrawer(anchor, true)}
                    >
                        신청자 목록
                    </Button>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <Box sx={{ width: 250 }} role="presentation"
                            onClick={toggleDrawer(anchor, false)}
                            onKeyDown={toggleDrawer(anchor, false)}
                        >
                            <List dense={dense}>
                                {applications.map((app: Applicant) => (
                                    <ListItem key={app.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="approve" onClick={() => approvedApplicant(app)}>
                                                <PersonAddOutlinedIcon />
                                            </IconButton>
                                        }

                                    /* 추후 secondaryAction 해당 유저 상태에 따라 바뀔 수 있게끔...<IconButton edge="end" aria-label="reject">
                                    <PersonAddDisabledOutlinedIcon />
                                    </IconButton>*/
                                    >
                                        <ListItemText primary={app.nickname} secondary={`학번: ${app.studentId.toString().slice(0, 2)}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}


