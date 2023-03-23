import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from '../../../layout/Header';
import MostViewedPost from '../../../layout/MostViewedPost';
import Time from "../../../layout/Time";
import { languageImage } from '../../../data/Image';
import { 
  Typography,
  Container, 
  Box,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import ProfileIcon from '@mui/icons-material/AccountCircle';

// BoardItems 인터페이스
interface BoardItems {
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    modifiedDate?: string;
    language?: string;
    bookmark: number;
    reply: number;
    point: number;
}

// MostViewedItems 인터페이스
export interface MostViewedItems {
    id: number;
    title: string;
    writer: string;
    language?: string;
    point: number;
}

const QnABaord: React.FC = () => {
    const [boardItems, setBoardItems] = useState<BoardItems[]>([]); // 인터페이스로 state 타입 지정
    const [mostViewedItems, setMostViewedItems] = useState<MostViewedItems[]>([]); // 인터페이스로 state 타입 지정

    const navigate = useNavigate();

    useEffect(() => {
        // 목록 조회 부분
        axios
            .get(`/api/qnaBoardsPage?page=0`)
            .then((response) => setBoardItems(response.data))
            .catch((err) => console.log(err));
        // 조회수가 높은 게시글 조회 부분
        axios
            .get(`/api/qnaBoards/most`)
            .then((response) => setMostViewedItems(response.data))
            .catch((err) => console.log(err));
    }, [])

    //게시글 선택시 해당 게시물 상세보기로 페이지 이동
    const goToPost = (postId: number) => {
        navigate(`/questions/${postId}`)
    }

    return (
        <>
        <Container>
        <Header/>
        {/* 조회수 높은 게시물 */}
        <MostViewedPost
            data = {mostViewedItems} // mostViewedItems 를 props 로 전달
        />
        <Typography variant="h5" sx={{marginTop: 8, marginBottom: 5}}>Q&A 게시판</Typography>
        <Box>
            {boardItems?.map((value) => {

            // 선택한 언어에 따른 해당 언어의 로고 이미지 출력
            const language = value.language ? (
                languageImage.map((data, index) => {
                    if (value.language === data.name) {
                        return (
                            <img src={data.url} width="25" height="25"/>
                        )
                    } 
                })
            ) : (null);

            return (
                <>
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        borderRadius: 2,
                        p: 2.5,
                        minWidth: 300,
                        marginTop: 2,
                        marginBottom: 4,
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                        },
                    }}
                    onClick={()=>goToPost(value.id)}
                >
                <Box sx={{display: 'flex', justifyContent: "space-between"}}>
                    <Typography sx={{color: 'text.primary', fontSize: 22, fontWeight: 'medium'}}>
                        {value.title}
                    </Typography>
                    <Box sx={{display: 'flex'}}>
                        <Typography sx={{marginRight: 1}}><Time date={value.createdDate}/></Typography>
                        {language}
                    </Box>
                </Box>
                <Box sx={{marginTop: 1, marginBottom: 1}}>
                    <div dangerouslySetInnerHTML={{ __html : (value.content) }}/>
                </Box>
                <Box
                    sx={{
                        fontWeight: 'bold',
                        mx: 0.5,
                        fontSize: 15,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{color: 'text.secondary', display: 'flex'}}>
                        <ProfileIcon sx={{marginRight: 0.5}}/>
                        <Typography>{value.writer}</Typography>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <BookmarkIcon/>
                        <Typography>{value.bookmark}</Typography>
                        <ChatIcon sx={{marginLeft: 1, marginRight: 0.5}}/>
                        <Typography>{value.reply}</Typography>
                    </Box>
                </Box>
                </Box>
                </>
            )
            })}
        </Box>
        </Container>
        </>
    );
};
  
export default QnABaord;