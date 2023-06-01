import React, {useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Typography, Box, Modal, Divider, Stack } from "@mui/material";
import Time from "./Time";
import { BoardType } from "../model/board";
import { FindIcon } from "../data/IconData";
import { userInfo } from "./postingDetail/userInfo";
import Shorten from "./Shorten";

interface HomeBoardItems {
    id: number;
    stuId: number;
    title: string;
    content: string;
    writer: string;
    profileImg: string | null;
    createdDate: string;
    bookmark: number;
    reply: number;
    introduce: string;
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

    const goToBoard = () => {
        navigate(`/${board}`)
    }

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

    const boardName: string = board === BoardType.free ? "자유게시판"
        : board === BoardType.question ? "Q&A게시판"
        : board === BoardType.recruit ? "구인게시판"
        : board === BoardType.notice ? "공지사항" : "";

    return (
        <>
            <Stack direction={"column"} sx={{m:3, mb:10}}>                 
                <Typography variant="h3" sx={{fontWeight: 550,
                    "&:hover": {
                        cursor: "pointer"
                    },
                    mb: "1rem"
                }} onClick={()=>goToBoard()}>{boardName}</Typography>
                {boardItems && boardItems.map((posting) => {
                    return (
                    <>
                    <Stack direction={"column"} 
                        spacing={"1rem"}
                        sx={{ 
                            p: '0.8rem 1.2rem 1rem 0.6rem',
                            m: '0.5rem',
                            height:'8.5rem',
                            '&:hover': {
                                backgroundColor: '#f2f2f2',
                                opacity: [1.0, 0.9, 0.9],
                            },
                            borderRadius:4
                        }}
                        onClick={() => props.loginState ? goToPost(posting.id) : null}>
                        <Stack direction={"column"} spacing={"0.5rem"}>
                            <Stack display={"flex"} justifyContent={"space-between"} direction={"row"} alignItems={"center"}>
                                {userInfo (posting.writer, posting.stuId, posting.profileImg, posting.introduce)}
                                <Time date={posting.createdDate}/> 
                            </Stack>

                            <Stack display={"flex"} justifyContent={"flex-start"} pl={"2.2rem"}>
                                <Typography variant="h4">{Shorten(posting.title, 18)}</Typography>
                            </Stack>

                            <Stack display={"flex"} justifyContent={"flex-end"} spacing={"0.5rem"} direction={"row"} alignItems={"center"}>
                                <Stack direction={"row"} spacing={"0.2rem"}>
                                <FindIcon name="reply"/>
                                <Typography variant="h5">{posting.reply}</Typography>
                                </Stack>
                                <Stack direction={"row"} spacing={"0.2rem"}>
                                <FindIcon name="bookmark"/>
                                <Typography variant="h5">{posting.bookmark}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
                </>
                );
                })}
            </Stack>
        </>
    );
};

export default HomeBoard;