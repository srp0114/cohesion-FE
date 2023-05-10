import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Chip, Checkbox, Collapse, Drawer, Divider, FormControlLabel, FormGroup, Grid, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, ListSubheader, Modal, Tooltip } from "@mui/material"
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from "axios";
import Profile from "../../../layout/Profile";
import { skillData } from "../../../data/SkillData";
import { useTheme } from "@mui/material/styles";

/**
 * 확인 or 취소겠죠 버튼 누른 사람의 학번,
 */

interface DoubleCheckModalProps {
    postingId: number;
    id?: number; //접속한 유저의 아이디
    targetId?: number; //승인, 승인 취소 대상의 아이디
    who: boolean; //접속한 유저가 작성자인지 신청자인지
    callNode: string; //모달을 부른 곳이 어디인지
    isComplete?: boolean;
    open: boolean;
    requireContext?: string;
    optionalContext?: string;
    onModalOpenChange?: (open: boolean) => void;
    onApplicantsChange?: () => void; //신청 인원수가 바뀌었는지 감지
    //onIsCompletedChanged?: () => void; //모집완료가 되었는지 감지
}
export const DoubleCheckModal = (props: DoubleCheckModalProps) => {
    const _theme = useTheme(); //시스템에 설정된 theme 불러옴(style/theme.tsx파일)

    const [open, setOpen] = React.useState<boolean>(false);
    const [isMeetRequired, setIsMeetRequired] = useState<boolean>(false);
    const [isMeetOptional, setIsMeetOptional] = useState<boolean>(false);

    const operators = [
        { who: false, callNode: "applyBtn" },
        { who: true, callNode: "completeBtn" }
    ];

    const sentences = [
        "신청하시겠습니까? (신청 후, 취소는 불가합니다.)",
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
        console.log(`request_apply: ${JSON.stringify(request_apply)} ${(request_apply)}`);
        axios({ //신청하기
            method: "post",
            url: `/api/recruit/${props.postingId}/application`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_apply),
        }).then((res) => {
            if (res.status === 200) {
                (props.onApplicantsChange) ? props.onApplicantsChange() : alert(`신청하는데 오류가 발생했습니다.`);
                alert(`partyId : ${res.data} ${JSON.stringify(res.data)} 신청이 완료되었습니다.`);
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const putRecruitComplete = (postingId: number) => {
        axios({
            method: "put",
            url: `/api/recruit/${postingId}/complete`,
        })
            .then((res) => {
                if (res.status === 200) {
                    alert(`${JSON.stringify(res.data)} 모집이 완료되었습니다.`);
                }
            })
            .catch((err) => console.log(err));
    }

    const applicationCheckbox = () => {
        if (props.optionalContext ?? false)
            return (
                <FormGroup sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                        {props.requireContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox required onChange={() => setIsMeetRequired(!isMeetRequired)} size="small" />} label="필수사항" labelPlacement="start" />
                    <Typography variant="subtitle1">
                        {props.optionalContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox onChange={() => setIsMeetOptional(!isMeetOptional)} size="small" />} label="우대사항" labelPlacement="start" />
                </FormGroup>
            );
        else
            return (
                <FormGroup sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                        {props.requireContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox required onChange={() => setIsMeetRequired(!isMeetRequired)} size="small" />} label="필수사항" labelPlacement="start" />
                </FormGroup>
            );
    }

    const confirmClickHandler = () => { //확인 버튼 눌렀을 때,
        const operator = designateOperator();
        switch (operator) {
            case 0:
                postApplicantInfo(); //신청정보서버로
                (props.onModalOpenChange) ? props.onModalOpenChange(false) : setOpen(false);
                break;
            case 1:
                putRecruitComplete(props.postingId); //모집완료정보서버로
                (props.onModalOpenChange) ? props.onModalOpenChange(false) : setOpen(false);
                break;
            default:
                alert("에러 발생");
                setOpen(false);
        }
    }

    const cancelClickHandler = () => {
        (props.onModalOpenChange) ? props.onModalOpenChange(false) : setOpen(false);
        alert("취소되었습니다");
    };

    return (
        <>
            <Modal
                open={props.open}
                onClose={cancelClickHandler}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Grid container xs={4} sx={doubleCheckModalstyle} spacing={'1.5rem'}>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4" sx={{ my: 2 }} fontWeight="800">
                            {designateSentence()}
                        </Typography>
                        <Divider variant="middle" />
                    </Grid>
                    {((props.who === false) && (props.callNode === 'applyBtn')) ? <Grid item xs={12} >{applicationCheckbox()}</Grid> : null}
                    <Divider variant="fullWidth" />
                    <Grid item xs={12}>
                        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Button className="modalCancelButton" onClick={cancelClickHandler} variant="outlined" color="info" >취소</Button>
                            <Button className="modalConfirmButton" onClick={confirmClickHandler} variant="contained" color="info" >확인</Button>
                        </Stack>
                    </Grid>
                </Grid>

            </Modal>
        </>
    );
}

const doubleCheckModalstyle = { //Home.tsx의 loginModalstyle에서 가져옴
    borderRadius: 5,
    p: 2,
    bgcolor: 'background.paper',
    boxShadow: 20,
};

/**
 * 게시글 작성자: 신청자들의 목록 전체를 볼 수 있음.
 *신청자 리스트 //신청을 완료 (더블체킹까지 완료한 신청자들의 목록)
 */

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface Application {
    // 유저 ID, 유저 닉네임, 필수/우대 사항 충족 여부, 프로필 사진, 학번, 1트랙, 관심 기술
    id: number,
    nickname: string,
    isMeetRequired: boolean,
    isMeetOptional?: boolean,
    profileImg: string,
    studentId: number,
    track1: string,
    skills: string[],

    isApproved: boolean,
    collapseOpen?: boolean,
}

export const ApplicantList = ({ postingId }: { postingId: number }) => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [applications, setApplications] = useState<Application[]>([]);

    React.useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`/api/recruit/${postingId}/applicants`);
                if (response.status === 200) {
                    console.log(`서버에서 받아온 신청자 목록 확인하기: ${JSON.stringify(response.data)}  ${typeof response.data}`);

                    const initialize = response.data.map((data: Application) => ({ //서버에서 받아온 신청자 목록 데이터
                        ...data,
                        collapseOpen: false //리스트의 collapse 여닫기를 위한 속성 추가
                    }));
                    setApplications(Array.from(new Set(initialize)));
                    console.log(`서버에서 받아온 신청자 목록 확인하기: ${JSON.stringify(applications)}  ${typeof applications}`);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchApplicants();
    }, [postingId]);

    const toggleCollapse = (index: number) => {
        setApplications((prevState) => {
            const updatedApps = [...prevState];
            updatedApps[index] = {
                ...updatedApps[index],
                collapseOpen: !updatedApps[index].collapseOpen
            };
            return updatedApps;
        });
    };

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

    const putApprove = (targetId: number) => {
        axios({
            method: "put",
            url: `/api/recruit/${postingId}/approval/${targetId}`,
        })
            .then((res) => {
                if (res.status === 200) {
                    const updatedApplications = applications.map((app) =>
                        app.id === targetId ? { ...app, isApproved: true } : app
                    );
                    setApplications(updatedApplications);
                    alert(`승인되었습니다.`);
                }
            })
            .catch((err) => console.log(err));
    }

    const putReject = (targetId: number) => {
        axios({
            method: "put",
            url: `/api/recruit/${postingId}/disapproval/${targetId}`,
        })
            .then((res) => {
                if (res.status === 200) {
                    const updatedApplications = applications.map((app) =>
                        app.id === targetId ? { ...app, isApproved: false } : app
                    );
                    setApplications(updatedApplications);
                    alert(`승인취소되었습니다.`);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div>
            {(["right"] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Tooltip title="신청자 목록">
                        <IconButton className="applicantListIconButton" onClick={toggleDrawer(anchor, true)} size="large">
                            <FolderSharedOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} PaperProps={{ sx: { width: "30%" } }} >
                        <Box>
                            <List dense={dense} >
                                <ListSubheader>
                                    신청자 목록
                                </ListSubheader>
                                {applications.map((app, idx) => (
                                    <><ListItem key={app.id} sx={{ p: 3 }} className="applicantsListItem">
                                        <Grid container xs={12} columnSpacing={2} >

                                            <Grid item xs={3}>
                                                <ListItemAvatar>
                                                    <Profile nickname={app.nickname} imgUrl={app.profileImg} size={48} />
                                                </ListItemAvatar>
                                            </Grid>
                                            <Grid item container xs={7} rowSpacing={1}>
                                                <Grid item>
                                                    <Typography variant="h4">{app.nickname}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h5">{`(${app.studentId.toString().slice(0, 2)}학번)`}</Typography>
                                                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        {app.isMeetRequired ? <Chip size="small" variant="outlined" label="필수사항 👌" color="primary" /> : <Chip size="small" variant="outlined" label="필수사항 ❌" color="primary" />}
                                                        {typeof app.isMeetOptional === 'boolean' && app.isMeetOptional ? <Chip size="small" variant="outlined" label="우대사항 👌" color="secondary" /> : null}
                                                        {typeof app.isMeetOptional === 'boolean' && !(app.isMeetOptional) ? <Chip size="small" variant="outlined" label="우대사항 ❌" color="secondary" /> : null}
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={2}>
                                                {(!app.isApproved) ? <Grid item xs={2}>
                                                    <Tooltip title="승인대기">
                                                        <IconButton edge="end" aria-label="approve" onClick={() => putApprove(app.id)} >
                                                            <PersonAddOutlinedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                                    : <Grid item><Tooltip title="승인완료"><IconButton edge="end" aria-label="reject" onClick={() => putReject(app.id)} >
                                                        <PersonAddDisabledOutlinedIcon />
                                                    </IconButton></Tooltip>
                                                    </Grid>}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemButton onClick={() => toggleCollapse(idx)}>{app.collapseOpen ? <ExpandLess /> : <ExpandMore />}</ListItemButton>
                                                <Collapse in={app.collapseOpen} timeout="auto" unmountOnExit>
                                                    {/* 신청자 정보 */}
                                                    {/* 1트랙 */}
                                                    <Typography variant="h5">1트랙: {app.track1}</Typography>
                                                    {/* 선택한 기술 */}
                                                    {(app.skills.length > 0) ? app.skills.map(skill => {
                                                        const matchingSkill = skillData.find(data => data.name === skill); // 일치하는 기술 데이터를 찾음
                                                        if (matchingSkill) {
                                                            return (
                                                                <Chip
                                                                    avatar={<Avatar src={matchingSkill.logo} />} // 일치하는 기술의 로고를 사용
                                                                    label={skill}
                                                                    sx={{ ml: 1 }}
                                                                    variant="outlined"
                                                                    color="info"
                                                                />
                                                            );
                                                        }
                                                    }) : <Chip avatar={<Avatar />} label="선택한 기술이 없습니다." sx={{ ml: 1 }} />}
                                                </Collapse>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                        <Divider />
                                    </>
                                ))}
                            </List>
                            <Divider />
                            <Tooltip title="닫기" sx={{ display: 'flex', flexStart: "flex-end" }}>
                                <IconButton onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} size="large">
                                    < DisabledByDefaultOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Drawer>
                </React.Fragment >
            ))
            }
        </div >
    );
}