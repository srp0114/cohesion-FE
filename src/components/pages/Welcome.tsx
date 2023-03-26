import React, { useState } from "react";
import { 
    Container,
    Box,
    Typography,
    TextField, 
    Button,
    Autocomplete,
    Stack
} from '@mui/material';
import { languageImage } from "../data/Image";
import "../style/Board.css"

// 회원가입 데이터- 받아온 정보
interface UserAccountItems {
    studentId: number; //학번
    name: string; //이름
    password: string; //비밀번호
    track1: string; //1트랙
    track2: string; //2트랙
    profileImg: string; //프로팔
}

const TestUserAccount : UserAccountItems = {
    studentId: 2071274,
    name: "김서영",
    password:"qwe123",
    track1: "웹공학 트랙",
    track2: "모바일소프트웨어 트랙",
    profileImg: "heys"
}

// 추가정보로 입력할 데이터
interface UserInfoItems {
    nickname: string; //닉네임
    skill?: Array<string>; //관심기술 - 최대 5개
    introduce?: string; //자기소개
}

const Welcome: React.FC = () => {
    //닉네임, 관심기술, 자기소개
    const [nickname, setNickname] = useState<string>();
    const [skill, setSkill] = useState<string[]>([]);
    const [introduce, setIntroduce] = useState<string>();

    const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
        console.log(nickname);
    }
    
    const onIntroduceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIntroduce(event.target.value);
        console.log(introduce);
    }

    return (    
        <>
        <Container>
        <Box sx={{m:5,p:1}}>
            <Typography variant="h5" align="center">추가 정보를 입력해주세요</Typography>
            <Typography variant="subtitle1" align="right">* 필수항목은 꼭 입력해주세요!</Typography>
        </Box>
        <Box sx={{pl:15, pr:15}}>
            <Stack spacing={5}>
                <Box>
                    <Typography>* 프로필을 선택해주세요</Typography>
                    <Box sx={{
                    display:"flex",
                    justifyContent: "space-between",
                    }}>
                    </Box>
                </Box>
                <Box>
                    <Typography>* 이름</Typography>
                    <TextField 
                    disabled
                    variant="outlined"
                    value={TestUserAccount.name}
                    fullWidth
                    InputProps={{ sx: {  backgroundColor:"#e0e0e0" }}}
                    />
                </Box>
                <Box>
                    <Typography>* 학번</Typography>
                    <TextField 
                    disabled
                    fullWidth
                    variant="outlined"
                    value={TestUserAccount.studentId}
                    InputProps={{ sx: {  backgroundColor:"#e0e0e0" }}}
                    />
                </Box>
                <Box sx={{
                    display:"flex",
                    justifyContent: "space-between",
                }}>
                    <Box sx={{width:"300px"}}>
                        <Typography>* 1트랙</Typography>
                        <TextField 
                        disabled
                        fullWidth
                        variant="outlined"
                        value={TestUserAccount.track1}
                        InputProps={{ sx: {  backgroundColor:"#e0e0e0" }}}
                        />
                    </Box>
                    <Box sx={{width:"300px"}}>
                        <Typography>* 2트랙</Typography>
                        <TextField 
                        disabled
                        fullWidth
                        variant="outlined"
                        value={TestUserAccount.track2}
                        InputProps={{ sx: { backgroundColor:"#e0e0e0" }}}
                        />
                    </Box>
                </Box>
                <Box>
                    <Typography>* 닉네임</Typography>
                    <TextField 
                    fullWidth
                    variant="outlined"
                    placeholder="닉네임을 입력해주세요!"
                    onChange={onNicknameChange}
                    />
                </Box>
                <Box>
                    <Typography>관심기술</Typography>
                    <Autocomplete
                        multiple
                        options={languageImage}
                        isOptionEqualToValue={(option, value) => option === value}
                        getOptionLabel={(option) => option.name || ""}
                        filterSelectedOptions
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="관심 기술을 선택해주세요."
                        />
                        )}
                        onChange={(event, value) => {
                            const addSkill = value as unknown as string
                            setSkill([...skill, addSkill]);
                          }}
                    />
                </Box>
                <Box>
                    <Typography>자기소개</Typography>
                    <TextField 
                    multiline
                    fullWidth
                    variant="outlined"
                    placeholder="본인소개를 해주세요."
                    rows={3}
                    onChange={onIntroduceChange}
                    />
                </Box>
                <Box sx={{ display:"flex", justifyContent:"flex-end"}}>
                <Button sx={{mr:1}}>뒤로</Button>
                <Button variant="contained">
                    완료
                </Button>
                </Box>
            </Stack>
        </Box>
        </Container>
        </>
    )
}

export default Welcome