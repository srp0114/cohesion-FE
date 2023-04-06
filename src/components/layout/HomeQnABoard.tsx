import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Time from "./Time";
import { Typography, Box, Modal } from "@mui/material";
import { RxAvatar } from "react-icons/rx";
import { BsBookmarkStar } from "react-icons/bs";
import { TfiCommentAlt } from "react-icons/tfi";
import "../style/Board.css";

// QnaBoardItems 인터페이스
interface QnaBoardItems {
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    language?: string;
    bookmark: number;
    reply: number;
    point: number;
    
}

const HomeQnABoard: React.FC = () => {
    const [qnaBoardItems, setQnaBoardItems] = useState<QnaBoardItems[]>([]);

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

    useEffect(()=>{
        axios({
            method : "get",
            url : "/api/qnaBoards"
        }).then((res)=>{
            setQnaBoardItems(res.data.data);
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
    },[])

    return (
        <>
        <div className="board" onClick={openInfoModal}>
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
                
        <Typography variant="h5" className="boardTitle">Q&A 게시판</Typography>
            {qnaBoardItems && qnaBoardItems.map((posting) => {
                return (
                    <>
                    <Box sx={{ 
                        width: 400, 
                        height: 130, 
                        '&:hover': {
                            backgroundColor: 'gainsboro',
                            opacity: [1.0, 0.8, 0.7],
                        },
                    }} className="box">
                    <p><RxAvatar size={30} className="icon"/></p> 
                    <p className="name">
                        {posting.writer} · <Time date={posting.createdDate}/> 
                        <img className="language" src={posting.language} />
                    </p>
                    <p className="title">{posting.title}</p>
                    <p className="comment"><TfiCommentAlt size={20}/> {posting.reply}</p>
                    <p className="bookmark"><BsBookmarkStar size={20}/>{posting.bookmark}</p>
                    </Box>
                    </>
                );
            })}
        </div>
        </>
    );
  }

// 추가정보입력 안내 모달 style
const addInfoModalStyle = {
    borderRadius: 5,
    width: 450,
    p: 3,
    bgcolor: 'background.paper',
    boxShadow: 20,
    transform: 'translate(0%, -100%)',
};
  
  export default HomeQnABoard;