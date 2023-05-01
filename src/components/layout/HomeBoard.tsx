import React, {useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Typography, Box, Modal, Divider } from "@mui/material";
import Time from "./Time";
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import Profile from "../layout/Profile";

interface HomeBoardItems {
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    bookmark: number;
    reply: number;
}

interface HomeBoardProps {
    board: string,
    loginState: boolean
}
  
const HomeBoard = (props: HomeBoardProps) => {
    const [boardItems, setBoardItems] = useState<HomeBoardItems[]>([]);

    //403 에러 여부 확인
    const [addInfoError, setAddInfoError] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
  
    const navigate = useNavigate();

    let board = props.board;

    const goToPost = (postId: number) => {
        navigate(`/${board}/${postId}`);
    };

    const openInfoModal = () => {
        if(addInfoError) { 
            setOpen(!open);
            setTimeout(() => {
                navigate('/redirect');
            }, 1500)
        }
    };

    // HomeFreeBaord, HomeQnaBoard -> HomeBoard 통합
    // home에서 board에 따라 api 설정하도록 변경
    useEffect(() => {
        axios({
            method : "get",
            url : `/api/${board}/main`
        }).then((res)=>{
            setBoardItems(res.data.data);
        }).catch((err)=>{
            console.log(err)
            if(err.response.status === 401) {
                console.log("401 - " + err);
            }
            else if(err.response.status === 403) {
                console.log("403 - " + err);
                setAddInfoError(true);
            }
        })

    }, []);

    const boardName: string = board === "free" ? "자유게시판"
        : board === "qna" ? "Q&A게시판"
        : board === "recruit" ? "구인게시판"
        : board === "notice" ? "공지사항" : "";

    return (
        <>
            <Box onClick={openInfoModal} sx={{m:3, mb:10}}>
                {/* 403에러 true인 경우 모달창 출력*/}
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                > 
                    <Box sx={addInfoModalStyle}>
                    <Typography align="center" variant="h6" sx={{mt:2}}>추가정보를 입력해주세요!</Typography>
                    <Typography align="center" variant="subtitle1" sx={{mt:1.5, mb:2}} >cohesion 추가정보 페이지로 이동합니다</Typography>
                    </Box>
                </Modal>
                
                <Typography variant="h6" sx={{mt:6, mb:2}}>{boardName}</Typography>
                {boardItems && boardItems.map((posting) => {
                    return (
                    <>
                    <Box sx={{ 
                        p: '1rem',
                        m: '0.5rem',
                        height:'9rem',
                        '&:hover': {
                            backgroundColor: '#f2f2f2',
                            opacity: [1.0, 0.9, 0.9],
                        },
                        borderRadius:5
                    }} 
                    onClick={() => props.loginState ? goToPost(posting.id) : openInfoModal()}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Box sx={{display:'flex'}}>
                                 <Profile nickname={posting.writer} size={30}/>
                                <Typography sx={{pt:0.5, pl:1.5}}>{posting.writer}</Typography>
                            </Box>
                            <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                                <Time date={posting.createdDate}/> 
                            </Box>
                        </Box>
                        <Box sx={{justifyContent:'flex-start', ml:5, mt:1}}>
                            <Typography variant="subtitle1">{posting.title}</Typography>
                        </Box>
                        <Box sx={{display:'flex', justifyContent:'flex-end', m:0.8}}>
                            <ChatIcon/><Typography sx={{pl:0.7, pr:1}}>{posting.reply}</Typography>
                            <BookmarkIcon/><Typography sx={{pl:0.7}}>{posting.bookmark}</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
                </>
                );
                })}
            </Box>
        </>
    );
};
  
// 추가정보입력 안내 모달 style
const addInfoModalStyle = {
    borderRadius: 5,
    width: 450,
    p: 3,
    bgcolor: 'background.paper',
    boxShadow: 20,
    transform: 'translate(0%, -100%)',
};

export default HomeBoard;