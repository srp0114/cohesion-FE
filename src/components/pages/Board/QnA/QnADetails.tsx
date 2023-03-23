import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Header from '../../../layout/Header';
import Time from "../../../layout/Time";
import { languageImage } from '../../../data/Image';
import { 
  Typography,
  Container, 
  Box,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import Money from '@mui/icons-material/MonetizationOn';

// Q&A 상세보기 데이터
interface DetailItems {
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

//Q&A 상세보기
const QnADetails: React.FC = () => {
    //postItem은 상세보기에 들어갈 데이터 - DetailItems에 데이터 타입 지정
    const [postItem, setPostItem] = useState<DetailItems | undefined>();

    //axios get 할 때 받아올 게시글 번호
    let { id } = useParams();

    useEffect(()=>{
        axios
            .get(`/api/qnaBoards/${id}`)
            .then((response)=>setPostItem(response.data))
            .catch((err)=>console.log(err))
    },[])

    //입력된 언어 맞게 이미지 출력
    const language = (postItem?.language) ? (
        languageImage.map((value) => {
            if (postItem.language === value.name) {
                return (
                    <img src={value.url} width="30" height="30" />
                )
            }
        })
    ) : (null);

    const PostDetails = postItem ? ( 
    //postItems 데이터 있는 경우 출력될 UI
    <>
    <Box sx={{
        display: 'flex',  
        marginTop: 8,
        marginBottom: 1
    }}>
        <Box sx={{fontSize:38, marginRight: 3}}>{postItem.title} </Box>
        <Box sx={{marginTop:2}}>{language}</Box>
    </Box>

    <Box sx={{
        display:'flex',
        justifyContent: 'space-between',
        marginBottom:8
    }}>
        <Box sx={{display:'flex'}}>
        <ProfileIcon sx={{fontSize:30, marginRight:0.5}}/>
        <Box sx={{fontSize:20}}>{postItem.writer} ∙ <Time date={postItem.createdDate}/></Box>
        </Box>
        <Box sx={{display: 'flex'}}>
            <BookmarkIcon sx={{fontSize: 28}}/>
            <Box sx={{fontSize:20}}>{postItem.bookmark}</Box>
        </Box>
    </Box>

    <Box sx={{
        fontSize: 20,
        marginBottom: 12
    }}>
        <div dangerouslySetInnerHTML={{ __html : (postItem.content) }}/>
    </Box>
    
    <Box sx={{ display:'flex', marginBottom:3}}>
        <Money sx={{color: '#ffcf40', fontSize:28}}/>
        <Box sx={{fontSize: 18, marginLeft:0.5}}>댓글 채택시 {postItem.point} 포인트를 적립해드립니다!</Box>
    </Box>

    <Box>
        <Typography variant='h5'>{postItem.reply}개의 댓글이 있습니다</Typography>
        <Box sx={{
            height:100,
            marginTop: 2,
            border: "1.5px solid grey",
            borderRadius: '16px',
        }}/>
    </Box>
    </>
    ) :     
    //postItems 데이터 없는 경우
    (<Typography variant='h3'>No Data</Typography>);

    return ( 
        <>
        <Container>
        <Header/>
        <Box>
            {PostDetails}
        </Box>
        </Container>
        </>
    )
}

export default QnADetails;