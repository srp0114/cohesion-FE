import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Checkbox, Drawer, Divider, Grid, FormGroup, FormControlLabel, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Modal } from "@mui/material"
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import axios from "axios";
import { skillData } from "../../../data/SkillData";

/**
 * 확인 or 취소겠죠 버튼 누른 사람의 학번,
 */

interface DoubleCheckModalProps {
    postingId: number;
    id: number; //접속한 유저의 아이디
    targetId?: number; //승인, 승인 취소 대상의 아이디
    who: boolean; //접속한 유저가 작성자인지 신청자인지
    callNode: string; //모달을 부른 곳이 어디인지
    isComplete?: boolean;
    condition?: boolean;
    open: boolean;
    onModalOpenChange: (open: boolean) => void;
    onApplicantChange?: () => void;
}
export const DoubleCheckModal = (props: DoubleCheckModalProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [isMeetRequired, setIsMeetRequired] = useState<boolean>(false);
    const [isMeetOptional, setIsMeetOptional] = useState<boolean>(false);

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

    const designateOperator = () => {
        const foundOperator = operators.find(
            (element) => props.who === element.who && props.callNode === element.callNode
        );
        if (foundOperator) {
            return operators.indexOf(foundOperator);
        } else {
            return -1;
        }
    };

    const designateSentence = () => {
        return sentences[designateOperator()];
    };

    const postApplicantInfo = () => {
        console.log(`postApplicantInfo입니다: ${JSON.stringify(isMeetRequired)} ${JSON.stringify(isMeetOptional)}`);
        const request_apply = {
            isMeetRequired: isMeetRequired,
            isMeetOptional: isMeetOptional
        }

        axios({ //신청하기
            method: "post",
            url: `/api/recruit/${props.postingId}/application`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_apply),
        }).then((res) => {
            if (res.status === 200)
                alert(`partyId : ${res.data} ${JSON.stringify(res.data)} 신청이 완료되었습니다.`);
        }).catch((err) => {
            console.log(err);
        });

        axios({ //신청자 목록 확인
            method: "get",
            url: `/api/recruit/${props.postingId}/applicants-number`,
        }).then((res) => {
            if (res.status === 200) {
                console.log(`신청자 수: ${JSON.stringify(res.data)}`);
            }
        }).catch((err) => {
            console.log(err);
        });

        axios({ //신청자 목록 확인
            method: "get",
            url: `/api/recruit/${props.postingId}/applicants`,
        }).then((res) => {
            if (res.status === 200) {
                console.log(`신청자 목록 확인하기: ${JSON.stringify(Array.from(new Set(Array.from(res.data))))} ${res.data} ${typeof Array.from(new Set(Array.from(res.data)))}`);
            }
        }).catch((err) => {
            console.log(err);
        });

        props.onModalOpenChange(false);
    }

    const applicationCheckbox = () => {
        if (props.condition)
            return (
                <FormGroup>
                    <FormControlLabel control={<Checkbox value="required" onChange={() => setIsMeetRequired(!isMeetRequired)} />} label="필수사항" />
                    <FormControlLabel control={<Checkbox value="optional" onChange={() => setIsMeetOptional(!isMeetOptional)} />} label="우대사항" />
                </FormGroup>
            );
        else
            return (
                <FormGroup>
                    <FormControlLabel control={<Checkbox value="required" onChange={() => setIsMeetRequired(!isMeetRequired)} />} label="필수사항" />
                </FormGroup>
            );
    }

    const confirmClickHandler = () => { //확인 버튼 눌렀을 때,
        const operator = designateOperator();
        switch (operator) {
            case 0:
                postApplicantInfo(); //신청정보서버로
                break;
            case 1:
                //클릭된 대상의 targetId 필요
                //putApprove(/*targetId */); //승인정보서버로
                break;
            case 2:
                //클릭된 대상의 targetId 필요
                // putReject(/*targetId */); //승인취소정보서버로
                break;
            case 3:
                // putRecruitComplete(); //모집완료정보서버로
                break;
            default:
                alert(`from: confirmClickHandler: something went wrong`);
                setOpen(false);
        }
        props.onModalOpenChange(false);
    }

    const cancelClickHandler = () => {
        props.onModalOpenChange(false);
    };


    return (
        <>
            <Modal
                open={props.open}
                onClose={cancelClickHandler}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={doubleCheckModalstyle}>
                    <Typography align="center" variant="h5" sx={{ mt: 2 }}>
                        {designateSentence()}
                    </Typography>
                    {((props.who === false) && (props.callNode === 'applyBtn')) ? applicationCheckbox() : null}
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Button onClick={confirmClickHandler}>Confirm</Button>
                        <Button onClick={cancelClickHandler}>Cancel</Button>
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

interface Application {
    // 유저 ID, 유저 닉네임, 필수/우대 사항 충족 여부, 프로필 사진, 학번, 1트랙, 관심 기술
    id: string | number,
    nickname: string,
    isMeetRequired: boolean,
    isMeetOptional?: boolean,
    profileImg: string,
    studentId: number,
    track1: string,
    skills: typeof skillData
}

export const ApplicantList = ({ postingId }: { postingId: number }) => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [applications, setApplications] = useState<Application[]>([]);

    React.useEffect(() => {
        const fetchApplicants = async () => {
          try {
            const response = await axios.get(`/api/recruit/${postingId}/applicants`);
            if (response.status === 200) {
              setApplications(Array.from(new Set(Array.from(response.data))));
              console.log(`서버에서 받아온 신청자 목록 확인하기: ${JSON.stringify(applications)}  ${typeof applications}`);
            }
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchApplicants();
      }, [postingId]);

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

    // const approvedApplicant = (targetApplicant) => { //승인된 신청자
    //     const request_approve = {
    //         boardId: targetApplicant.postingId,
    //         userId: writerId,
    //         targetUserId: targetApplicant.id
    //     }
    //     //신청 승인정보를 서버로 보내기
    //     axios({
    //         method: "put",
    //         url: `/api/recruit/${targetApplicant.postingId}/approval/${targetApplicant.id}`,
    //         headers: { "Content-Type": "application/json" },
    //         data: JSON.stringify(request_approve),
    //     })
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 alert(`승인되었습니다. ${targetApplicant.isApproved} Hello, ${targetApplicant.nickname}!`);
    //             }
    //         })
    //         .catch((err) => console.log(err));
    // }

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
                                {applications.map((app) => (
                                    <ListItem key={app.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="approve" onClick={() => console.log(`승인`)}>
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