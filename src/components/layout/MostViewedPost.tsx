import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MostViewedItems } from "../pages/Board/QnA/QnABoard";
import { languageImage } from '../data/Image';
import {
  Box, Typography,
} from '@mui/material';

// props 인터페이스
interface MostViewedPostProps {
    data: MostViewedItems[] // QnABoard 내부에 정의된 MostViewedItems 인터페이스의 배열로 props 타입 지정
}

// 조회수 높은 게시글 컴포넌트
const MostViewedPost: React.FC<MostViewedPostProps> = (props) => {
    const navigate = useNavigate();
    
    //게시글 선택시 해당 게시물 상세보기로 페이지 이동
    const goToPost = (postId: number) => {
        navigate(`/questions/${postId}`)
    }

    //출력될 박스 배경색
    const color : string[] = [
        '#FF9C8C', '#D2E866', '#FFDF8C', '#A6DEFF',
    ]

    return (
        <Box sx={{ display: 'flex', justifyContent:'space-between', marginTop:5 }}>
        {props.data.map((value, index) => {

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
                <Box sx={{
                width: 250,
                height: 180,
                borderRadius:7,
                p:1,
                backgroundColor: color[index],
                m:1.2,
                position: 'relative',
                '&:hover': {
                opacity: [0.9, 0.8, 0.7],
                },
                }}
                onClick={()=>goToPost(value.id)}
                >
                    {language}
                    <Box sx={{
                    bottom:0,
                    position: "absolute", 
                    p:2,
                    }}>
                    <Typography sx={{fontSize:18}}>{value.title}</Typography>
                    </Box>
                </Box>
                </>
            )
        }
        )}
        </Box> 
    )
    }

export default MostViewedPost