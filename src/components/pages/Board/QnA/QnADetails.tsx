import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from '@mui/material';
import Time from "../../../layout/Time";
import Reply from "../../../layout/Reply/QnAReply";
import { skillData } from '../../../data/SkillData';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import Money from '@mui/icons-material/MonetizationOn';
import Visibility from '@mui/icons-material/VisibilityOutlined';

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
  views: number; //조회수
  reply: number;
  point: number;
}

//Q&A 상세보기
const QnADetails = () => {
  //postItem은 상세보기에 들어갈 데이터 - DetailItems에 데이터 타입 지정
  const [postItem, setPostItem] = useState<DetailItems | undefined>();

  //axios get 할 때 받아올 게시글 번호
  let { id } = useParams();

    useEffect(()=>{
        axios({
            method : "get",
            url : "/api/qnaBoards/"+id,
        }).then((res)=>{
            if(res.status ===200){
                setPostItem(res.data);
            }
        }).catch((err)=>{
            if(err.response.status===401){
                console.log("로그인 x");
            }else if(err.response.status===403){
                console.log("권한 x");
            }
        });
    },[])


  //입력된 언어 맞게 이미지 출력
  const Skill = (postItem?.language) ? (
      skillData.map((value) => {
          if (postItem.language === value.name) {
              return (
                  <img src={value.logo} width="30" height="30" />
              )
          }
      })
  ) : (null);

  const PostDetails = postItem ? (
    //postItems 데이터 있는 경우 출력될 UI
    <>
    <Box sx={{
        display: 'flex',  
        mt: 8,
        mb: 3
    }}>
        <Box sx={{fontSize:38, mr: 3}}>{postItem.title} </Box>
        <Box sx={{marginTop:2}}>{Skill}</Box>
    </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <ProfileIcon sx={{ mr: 0.5, fontSize: 45 }} />
          <Box>
            <Typography sx={{ fontSize: 20 }}>{postItem.writer}</Typography>
            <Box color="gray">
              <Time date={postItem.createdDate} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <BookmarkIcon />
          <Typography>{postItem.bookmark}</Typography>
          {/* 조회수 UI 추가 */}
          <Visibility sx={{ ml: 1 }} />
          <Typography>{postItem.views}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          fontSize: 20,
          mt: 12,
          mb: 18,
          ml: 6,
          mr: 6,
        }}
      >
        {/*코드블럭 배경 css 추가*/}
        <div className="ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: postItem.content }}
          />
        </div>
      </Box>

      <Box sx={{ display: "flex", marginBottom: 3 }}>
        <Money sx={{ color: "#ffcf40", fontSize: 28 }} />
        <Box sx={{ fontSize: 18, marginLeft: 0.5 }}>
          댓글 채택시 {postItem.point} 포인트를 적립해드립니다!
        </Box>
      </Box>

      <Box>
        <Typography variant="h5">
          {postItem.reply}개의 댓글이 있습니다
        </Typography>
          {/*댓글 입력창 텍스트필드로 변경*/}

        <Reply postingID={id}/>
      </Box>
    </>
  ) : (
    //postItems 데이터 없는 경우
    <Typography variant="h3">No Data</Typography>
  );

  return (
    <>
      <Box>{PostDetails}</Box>
    </>
  );
};

export default QnADetails;
