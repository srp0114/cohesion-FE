import React, {useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Typography, Box, Modal, Divider } from "@mui/material";
import Time from "./Time";
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import "../style/Board.css";

// FreeBoardItems 인터페이스
interface FreeBoardItems {
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    bookmark: number;
    reply: number;
}
  
const HomeFreeBoard = () => {
    const [boardItems, setBoardItems] = useState<FreeBoardItems[]>([]);

    //403 에러 여부 확인
    const [addInfoError, setAddInfoError] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
  
    const navigate = useNavigate();

    // error(true)인 경우 클릭 시, 모달 출력
    const openInfoModal = () => {
        if(addInfoError) { 
            setOpen(!open);

            // 모달창 열린 후 1.5초 후 리다이렉트 -> 추가정보페이지로 이동
            setTimeout(() => {
                navigate('/redirect');
            }, 1500)
        }
    };

    useEffect(() => {
        axios({
            method : "get",
            url : "/api/freeBoards"
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

    return (
        <>
            <Box onClick={openInfoModal} sx={{m:3}}>
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
                
                <Typography variant="h5">자유게시판</Typography>
                {boardItems && boardItems.map((posting) => {
                    return (
                        <>
                       <Box sx={{ 
                        height:130,
                        '&:hover': {
                            backgroundColor: 'gainsboro',
                            opacity: [1.0, 0.8, 0.7],
                            borderRadius:2
                        },
                        m:2, 
                        p:2, 
                        border:'1.2px solid gainsboro',
                        borderRadius:5
                        }}>
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Box sx={{display:'flex'}}>
                            <UserIcon fontSize="large"/>
                            <Typography sx={{pt:0.8, pl:0.5}}>{posting.writer}</Typography>
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
                    <Divider/>
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

export default HomeFreeBoard;