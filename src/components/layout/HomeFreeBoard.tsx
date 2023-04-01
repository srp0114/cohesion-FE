import React, {useEffect, useState} from "react";
import axios from "axios"
import Time from "./Time";
import { 
    Typography,
    Box,
    ButtonBase,
    Modal,
    Dialog
 } from "@mui/material";
import { RxAvatar } from "react-icons/rx";
import { BsBookmarkStar } from "react-icons/bs";
import { TfiCommentAlt } from "react-icons/tfi";
import "../style/Board.css";
import { styled } from "@mui/material/styles";
import hansung from  "../asset/image/hansung.png";
import { useNavigate } from "react-router-dom";

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

const style = {
    borderRadius: 5,
    width: 450,
    p: 3,
    bgcolor: 'background.paper',
    boxShadow: 20,
    transform: 'translate(0%, -100%)',
};
  
const Board: React.FC = () => {
    const [boardItems, setBoardItems] = useState<FreeBoardItems[]>([]);

    //403 에러 여부 확인
    const [addInfoError, setAddInfoError] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
  
    const navigate = useNavigate();

    //error(true)인 경우 클릭 시, 모달 출력
    const openInfoModal = () => {
        if(addInfoError) { 
            setOpen(!open);

            //모달창 열린 후 1.5초 후 리다이렉트 -> 추가정보페이지로 이동
            setTimeout(() => {
                navigate('/redirect');
            }, 1500)
        }
    };

    useEffect(() => {
        axios
            .get("/api/freeBoards")
            .then((response) => setBoardItems(response.data.data))
            .catch((error) => { 
                console.log(error)
                if(error.response.status === 401) {
                    console.log("401" + error);
                }
                else if(error.response.status === 403) {
                    console.log("403" + error);
                    setAddInfoError(true);
                }
            });
            
    }, []);

    return (
        <>
            <div className="board" onClick={openInfoModal}>

                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                > 
                    <Box sx={style}>
                    <Typography align="center" variant="h6" sx={{mt:2}}>추가정보를 입력해주세요!</Typography>
                    <Typography align="center" variant="subtitle1" sx={{mt:1.5, mb:2}} >cohesion 추가정보 페이지로 이동합니다</Typography>
                    </Box>
                </Modal>
                
                <Typography variant="h5" className="boardTitle">자유게시판</Typography>
                {boardItems && boardItems.map((posting) => {
                    return (
                        <div>
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
                            </p>
                            <p className="title">{posting.title}</p>
                            <p className="comment"><TfiCommentAlt size={20}/> {posting.reply}</p>
                            <p className="bookmark"><BsBookmarkStar size={20}/>{posting.bookmark}</p>
                        </Box>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
  
  export default Board;