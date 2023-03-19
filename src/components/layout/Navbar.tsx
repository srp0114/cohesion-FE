import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {Menu, Button, Box} from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import { RxAvatar } from "react-icons/rx";
import "../style/Home.css";

const Navbar: React.FC = () => {
    
    const movePage = useNavigate();
    
    const moveToHome = () => {
        movePage('/');
    }
    const moveToFree = () => {
        movePage('/free');
    }
    const moveToQna = () => {
        movePage('/questions');
    }
    const moveToRecruit = () => {
        movePage('/recruit');
    }
    const moveToNotice = () => {
        movePage('/notice');
    }
    const moveToMyPage = () => {
        movePage('/mypage');
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Box sx={{display:'flex', justifyContent:'flex-start', marginLeft: 3}}>
                    <Button onClick={moveToHome} sx={{color:'black', paddingLeft:3, paddingRight:3}}>홈</Button>
                    <Button
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{color:'black', paddingLeft:3, paddingRight:3}}
                    >
                        게시판
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={moveToFree}>자유게시판</MenuItem>
                        <MenuItem onClick={moveToQna}>Q&A게시판</MenuItem>
                        <MenuItem onClick={moveToRecruit}>모집게시판</MenuItem>
                    </Menu>
                    <Button sx={{color:'black', paddingLeft:3, paddingRight:3}}>학부정보</Button>
                    <Button onClick={moveToNotice} sx={{color:'black', paddingLeft:3, paddingRight:3}}>공지사항</Button>
                </Box>
                <Box sx={{marginTop:0}}>
                    <RxAvatar size={30} className="myPageIcon" onClick={moveToMyPage}/>
                </Box>
            </Box>
        </div>
    );
  }
  
  export default Navbar;