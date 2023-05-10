import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Chip, Checkbox, Collapse, Drawer, Divider, FormControlLabel, FormGroup, Grid, Stack, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, ListSubheader, Modal, Tooltip } from "@mui/material"
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { skillData } from "../../../data/SkillData";
import { useTheme } from "@mui/material/styles";

/**
 * 확인 or 취소겠죠 버튼 누른 사람의 학번,
 */

interface DoubleCheckModalProps {
    postingId: number;
    id?: number; //접속한 유저의 아이디
    targetId?: number; //승인, 승인 취소 대상의 아이디
    who: boolean; //접속한 유저가 작성자인지 신청자인지
    callNode: string; //모달을 부른 곳이 어디인지
    isComplete?: boolean;
    open: boolean;
    requireContext?: string;
    optionalContext?: string;
    onModalOpenChange?: (open: boolean) => void;
    onApplicantChange?: () => void;
}
export const DoubleCheckModal = (props: DoubleCheckModalProps) => {
    const _theme = useTheme(); //시스템에 설정된 theme 불러옴(style/theme.tsx파일)

    const [open, setOpen] = React.useState<boolean>(false);
    const [isMeetRequired, setIsMeetRequired] = useState<boolean>(false);
    const [isMeetOptional, setIsMeetOptional] = useState<boolean>(false);

    const operators = [
        { who: false, callNode: "applyBtn" },
        { who: true, callNode: "completeBtn" }
    ];

    const sentences = [
        "신청하시겠습니까? (신청이 완료된 후, 취소는 불가합니다.)",
        "모집을 완료하시겠습니까?"
    ]

    const designateOperator = () => {
        const foundOperator = operators.find(
            (element) => props.who === element.who && props.callNode === element.callNode
        );
        if (foundOperator) {
            return operators.indexOf(foundOperator);
        } else {
            return -1;
        }
    };

    const designateSentence = () => {
        return sentences[designateOperator()];
    };

    const postApplicantInfo = () => {
        console.log(`postApplicantInfo입니다: ${JSON.stringify(isMeetRequired)} ${JSON.stringify(isMeetOptional)}`);
        const request_apply = {
            isMeetRequired: isMeetRequired,
            isMeetOptional: isMeetOptional
        }

        axios({ //신청하기
            method: "post",
            url: `/api/recruit/${props.postingId}/application`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_apply),
        }).then((res) => {
            if (res.status === 200)
                alert(`partyId : ${res.data} ${JSON.stringify(res.data)} 신청이 완료되었습니다.`);
        }).catch((err) => {
            console.log(err);
        });

        axios({ //신청자 목록 확인
            method: "get",
            url: `/api/recruit/${props.postingId}/applicants-number`,
        }).then((res) => {
            if (res.status === 200) {
                console.log(`신청자 수: ${JSON.stringify(res.data)}`);
            }
        }).catch((err) => {
            console.log(err);
        });

        axios({ //신청자 목록 확인
            method: "get",
            url: `/api/recruit/${props.postingId}/applicants`,
        }).then((res) => {
            if (res.status === 200) {
                console.log(`신청자 목록 확인하기: ${JSON.stringify(Array.from(new Set(Array.from(res.data))))} ${res.data} ${typeof Array.from(new Set(Array.from(res.data)))}`);
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const putRecruitComplete = (postingId: number) => {
        axios({
            method: "put",
            url: `/api/recruit/${postingId}/complete`,
        })
            .then((res) => {
                if (res.status === 200) {
                    alert(`${JSON.stringify(res.data)} 모집이 완료되었습니다.`);
                }
            })
            .catch((err) => console.log(err));
    }

    const applicationCheckbox = () => {
        if (typeof props.optionalContext !== undefined)
            return (
                <FormGroup>
                    <Typography variant="subtitle1">
                        {props.requireContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox required value="required" onChange={() => setIsMeetRequired(!isMeetRequired)} size="small"/>} label="필수사항" labelPlacement="start" />
                    <Typography variant="subtitle1">
                        {props.optionalContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox value="optional" onChange={() => setIsMeetOptional(!isMeetOptional)} size="small"/>} label="우대사항" labelPlacement="start" />
                </FormGroup>
            );
        else
            return (
                <FormGroup>
                    <Typography variant="subtitle1">
                        {props.requireContext}
                    </Typography>
                    <FormControlLabel control={<Checkbox required value="required" onChange={() => setIsMeetRequired(!isMeetRequired)} size="small"/>} label="필수사항" labelPlacement="start" />
                </FormGroup>
            );
    }

    const confirmClickHandler = () => { //확인 버튼 눌렀을 때,
        const operator = designateOperator();
        switch (operator) {
            case 0:
                postApplicantInfo(); //신청정보서버로
                break;
            case 1:
                putRecruitComplete(props.postingId); //모집완료정보서버로
                break;
            default:
                alert(`from: confirmClickHandler: something went wrong`);
                setOpen(false);
        }
        (props.onModalOpenChange) ? props.onModalOpenChange(false) : setOpen(false);

    }

    const cancelClickHandler = () => {
        (props.onModalOpenChange) ? props.onModalOpenChange(false) : setOpen(false);
    };


    return (
        <>
            <Modal
                open={props.open}
                onClose={cancelClickHandler}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Grid container xs={4} sx={doubleCheckModalstyle} spacing={'1.5rem'}>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4" sx={{ mt: 2 }} fontWeight="800">
                            {designateSentence()}
                        </Typography>
                    </Grid>
                    {((props.who === false) && (props.callNode === 'applyBtn')) ? <Grid item xs={12} >{applicationCheckbox()}</Grid> : null}
                    <Grid item xs={12}>
                        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Button onClick={confirmClickHandler}>Confirm</Button>
                            <Button onClick={cancelClickHandler}>Cancel</Button>
                        </Stack>
                    </Grid>
                </Grid>

            </Modal>
        </>
    );
}

const doubleCheckModalstyle = { //Home.tsx의 loginModalstyle에서 가져옴
    borderRadius: 5,
    p: 4,
    bgcolor: 'background.paper',
    boxShadow: 20,
};

/**
 * 게시글 작성자: 신청자들의 목록 전체를 볼 수 있음.
 *신청자 리스트 //신청을 완료 (더블체킹까지 완료한 신청자들의 목록)
 */

//더미데이터
const dummy: Application[] = [{
    id: 1,
    nickname: "오늘은",
    isMeetRequired: true,
    isMeetOptional: true,
    profileImg: "data:image/jpeg;base64,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",
    studentId: 1871308,
    track1: "모바일소프트웨어",
    skills: [{ name: "C", logo: "../../asset/image/c.png" }, { name: "C++", logo: "../../asset/image/c.png" }],
    isApproved: true,
},
{
    id: 2,
    nickname: "어버이날",
    isMeetRequired: true,
    isMeetOptional: false,
    profileImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFWuAfrWAlFqMWsecAd33AZ_Gd5XAJQYgJkw&usqp=CAU",
    studentId: 1891239,
    track1: "빅데이터",
    skills: [{ name: "React", logo: "../../asset/image/react.png" }, { name: "C", logo: "../../asset/image/c.png" }],
    isApproved: false,
},
{
    id: 3,
    nickname: "카네이션",
    isMeetRequired: true,
    isMeetOptional: true,
    profileImg: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEBUSEhAQFRUQFRUVEBcVFRAQFRUVFxUWFxUWFRcYHSggGBonGxUVITEiJSkrLi4uGB80OTQsOCgtLisBCgoKDg0OGxAQGi0lHyUtLS0tLS0vLS0tLS0tLS0vLSstLy0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIEAwUHBgj/xABBEAACAQIEAgYHBQYEBwAAAAABAgADEQQSITEiQQUGEzJRYQdCUnGBkaFicoKx8BSSssHR4TOiwtIjJDRTc+Lx/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAECAwQFBgf/xAA0EQABAwMCBAUDAgYDAQAAAAABAAIRAyExBEESUWFxBROBkbEiofAGMhQjQlLB0XLh8Rb/2gAMAwEAAhEDEQA/AOrwheK8sicIXkbwiJISJheEQYo4QiDFCEqiIQhCIhCEIiEJIQiQkohHCIhCOERFHaKSCiIQhJREIQhEQhCERCEIRK8QheEIgxQhCJiKEIROEIQVCUI4pVSiEccIoxwjEIi0cUcIiOIRwiIQEcIlCOKEShCO8siUI4GEShHCEShHeEIoAwiheEThFC8IiEd4QiISMYkFE4TDisUlJS7sqKLXZjYC5sPqZhxfSSJQNcHOoTOCuuYcrESpICs1jnEQDcwOp5d/wrLjMWlFC9R1VV3J0+A8T5TCOlKRoiv2g7NgCG1G5sBbe99LTlHWjp84uqWRqopmxCM2ZQwFjYDTmdd9TKydNOML+z3b/EWouugOUqdPfb43mmdZcwLbL1VL9MONNjnuIcSOIWs2LjuDvjuu2wBnFqfXHGZ0Zq7t2b3AvYE881hqCJtek+vddq2ei2SmCMqaage0ed/I/wBZcatnIrU/+a1fEAHNNjJkwCNsTfa3/fVTATxT+kGmlFaj0+NwSiB1IsGC3c6Zbm/I7SfRPX+liMRTo9m69rZQSy6OR4DlfS9/hMor0zF1zT4Xqw1zjTMCZuNs739F7OOch6ydaK9XEN2dVlRX4FDFbZLhTp53+c2nRXpDKU6aVlzMGs7C12p20sCRx357WExjVMJIW/V/TurZSbUbDictGRad88j15rpUJ53oXrhQxRbenltcuUUEm9gDffQz0COCLggg7EagzO1wcJC41ajUovLKggjY9VOIwvCWWJEUISwREIQhEQhFeEThFeEIlEYyZGFCI4oQicUcxYiulNC9Rgqr3mJsBrbUwpAJMBSdwBcmwG/KeWxnXmiqVWRc7UHAIJAujMAXB15m3xHjPPekLrJUNU4ZQyots+3/ABQbEEG1wNeR1vPHJXy8QAbQ3U7OhFmU/rQ2PKaVbUw7hb6/nT7r1Hh/gHmafz6tzYtb0zf/AJDEYsZk29H0h1nrdIE0hlppVRRluTxqSVI2tmbTnylHoXp+phDqWakC5emxNmUiz6HY/wAxPP4OprYX8vGXKtYuxYm5Judhc8zNM1HTJN16ahodO6h5YaOAjHWInnMb5EZUXYE3Gx2vobctJEtI4jaYlaYiIsugavC7hKg28zUXkHExqbERlawcab+itMt9DMeBrmlVRhujAj3g3Eatc/Ziq1NriBIV6zWVBJxjuPzCzMbmYqhAiqVrC9vdKyteALJX1AH0jK2OGxTBWTZXYORYakZgNfxmem6P6z12q0RTdadLC00Ugk5AFUKzuARmJJ29wE8ij2EGqSWvIwVhraajVZ9YE32nIg2xgR2X0B0b0hTxFMVKbZkJIBsV2NjodeUtTm/o+6yBSmEKGzMbNm1zXtr5aAf/AHTpE69KoKjZ91878Q0TtJXNMi2WzeW7GyLxQjmYLQKIoRyEUDCMiIiSpShCEIiKEIUJxQhCImh674pqeBqsqhwRka99FYWzC3MEibx3CgkkAAXJOgA8TOPdaOlia9ZKVd2puTfjYhgdxbYrvbymDUVOBney6/g2iOqrzs2HXFjBFp2PLt0Wgq4l6llZjwDKt9bL7IO9vLlIM1hfwkVGh+zIvU0nJXvwRTads/nukigXI9b8pMa285VpvbSZ1e1Jvs/wwWyVhpVmkR0JjtdZKxsp+EpviQvvklq9ppyHE3wlQVP2i4LKrU7lW04kvrm+7pLsZuVranUyR5Zuf29SLm+3SdxHJXMHWLPYfGRq4mzMoOqmY6FEGi4psWY6Zgcnd9k+zKuGwvZNnqlMi+feb1Vlg1t/hYHVq7WMbzuXTYC9pxYXPsrAxBDjPm/FLVTEgmFPA9rxVDxNfKvq01Ow+1b5TQrXsd9pYUw/0VK+oq6QDiw4yCc25+69JcFWvaVnTKL39lv3prcdjLqKY+8/v9Vf14zY4ttddmVcv4fVmPyy2J3WwdWysHQLtAE9SD8GB3URVlmgZTWkTtxSytMg5cshwGytp3P4g4gwvUdS6lNcbRao2VQ2h17x0TbYXInX8D0lRrZuzqK/ZnK+U3AJ5X2Pwnz8K+mk3HVbrC2CrFrXDi1iWsLuLnKNzlBA98zaav5diLLU8a8ObrD5tN/1BsAbG859fhd0ilfB4tK1NalNgyOLqRcXHuOome86owvCkEGCnCK8LwoQYoRQiIQhCKN4XheBEKEXgYhKvShqChUNNlVwjFWIuAwBsSLH8j7jtBVgJIC0fXXrIuEp5AFepUFshGYBDoc4BBAIuBOO4hgWJC2uSVFy1hyF+czY/HvWqF6jFnY8RO50sPoBIhwBpz3nHrVjUdJwvoHh3h1PTU+AOvlx69B02m+Scpoth+GU3aZGqTDg0vUAPd4pjaFs1qgeWsb2+6yCgM6rfvcTfmZiq41RnbRe8qjfg+7MLLVWsme1tGzaFcvh5SLdGrUohgcpLtxNfLlzsoBHKZgxv9RtZabq1YhzaLIcJMGxgBuPcnIE7qtRqMyFaa2Re+zf6m/0iFLAIwLMWbzRkC+7mZbALsaaLelTWx0zZsveZV+9+UotjrKQKYQcly/z3mUFx/aubUbSpgGt9ViBItI/tERwjnvndbJlpGmqpnPaMtMFWJAJseZ8QZrCQM9MDPlchDsRY6Nf4TL0SSgTtFayNnTcNpe3+bLA4cHE5SpCu6VMrcJyk3Py1kiGkgnqpqk16dN7WgEkMiIgEdsTg3PJbfpHF9nhy5GuioPP+2p+E0dSmvZl2pdnqAmrcXtaHZZtekqbGoFdBUV3YrxBbDzOmXf4yutPM5YkMA3rBWY+/h4fhMdMhjfz2/8AQtrxBrq9Ug4A4QCBmDLjI5EEcLuRO04ce61ezdqio5TjBXTfRuHbcyziLqFVtVZcy7of3Y6eBpZ2azPlaz5uJVbNf9bzDjKJqViyMzK1uJtvNU9oe6SC0wNhz/J91WpTqNDqhAL3ECxJJ2JINji8CxuTZWsHVCi5lp2vSY+P9Zr8WwUpT/7S8X3jvLGHxi5Src5hcz+oBb2n1AYTRc4CAR6x/jHokgmVWjpsDzvM7AAWsFlCVsUaVpB/Phej6h9YEwdd2r1KgRkICrdgWzCxK+5W1nWOiOlKWKpdrRYlbldRYgjcEcuU+eyZ630cY6rTxqU0uUq3VxfQg3JP4bZvgRzm1p6xaQ3b/a4nivhrK7X12mHAT0IAv6xuuxwhCdJePTihFCJwjihQlaIiF4XhFGaTrX07TwlE5zx1VYUhYsGJFrtyyjMLzeznvpQwTuUqrRcrTXjqBlyqLtdStr81O/5THWc5rCW5W94dSp1dSxlU/SeoHYe/K/Jc3qC5J8ZG1vxQDyYM4uF9As4yMqsd4EWNxustlBaVwQDrLgrDUolhEn1WbFVe5b1l/wBv9ZGkEWmQFGXimHpAFwLbrqJKkuYoVOX21b7sRIVzVLq7uEA2EY3gHPa4n4WvGOemisWuXNhoq2siNY237/0mwxLoaBrFqgv3CrseLRbHl3hzlXG4E1rouUFWZlysMp5cS75rraVsPh74I3qBeItrz4dB+U2oYYd1hcsP1FOo+lBLeAls/wBzYBzHOc8r2RmYoCDrTOb4Nw3/AIZlxNYftS1u8MyqNdO7lVvnxTWYMlQwubMjKPpG7E0j5EW/XvmTy4MenuuY3V/ygYvZ3qyY+3wt66CoGzesdZQ6PvlJfhytl1/X6tI9GYpmFt29o/rWbns1YZCC3Fm8r2yzXP8ALlpXWoNbrOGs2xAOdydjvY8uajhauThtlHfJ3zes5Zjprosq9LcNBDsQlluuVhmIuMszhytRlCr2eVVfNqubS2/e4cvzjrU+2bNUZMiapsSSedjwiVaYMnutys1z6LqTc3aNouL7WEWMZtaL62s+ZVNUf8Rz6umZLd5vBtvfLNbBCmucNmAy5gd9ZTxdEmoi02zsE123tmOs22LcCkFJTM+Xb3i8u8xwxvstGhTbU801BdogO5ui98Eyb/hOPoxrm8t4mnoXv4WmCgvHqvqhR/u/XhFiKt+EbL9TMBu5dOmRT03C652781ATZ9C9IPh66VKdsyMLXFxrcaj3Ga3s+cz0BxgeYkExdVosl3C8WNu4K+guisSatCnUYAGoiMwGwLKCbeUtTBgaWSjTX2ERf3VA/lM87gmBK+cvILjw427IhCF4VEoRXhCSowijhEp4r0l9MLTpDDFCTVUOWuQAATbbfUfSe2nluv8A0EMThmqIhNWit1sSCUUkstvW5kDx+uKuHGmeFb3htSkzVMdVxPa+x7A56ZtY8canEqkRB5kFUTj3XvBwOMzClUey/emvZjL1XilPLLsssOsJc4QbKSPbeWsOoHH8B96UiZYTOAAq6HiPLf8A9ZLgq6Z8OuJjG99lNKxFTNk24XbgG235zXYaqlNDTdiyq2ZOEPlF8oJ+c2TYZL+u34pkq02JGpycOVtOH7P0/KGuEQstTTVieKbgmN/3ZmOG1hzveRla5aKVTcAqthfk18wb4bCR6eUP2mlnDK17Fe0Urrpzy+Mq4IFKrpfuluL6j+U3rZSGHeHZZXY+C7fzMyuPA4fZaenpt1enfTIDXXBsMgOFuxOR9xIWo6HwZ7DPrnZuBdgw+MtUauqjRi37q87fe8fKWsK4zBRoFXKg+zM9RQAxt3rH/LlmN9SXElbWm0LWUW+W79og9YuTHM49QQqmMGz2/wAK7MvJuG1/hKL4liezsovqfZVfWmaridJgw9MuQdMmZlbe7DLxZZZotdamoqmpUimcxIHse23zElW6VGwVUGtUvq3e03zfxZZZamA1wiXXhElQuDtoO7z4Zkr6jz5TC5xldelQa2nI22jly9bqjUY/PeRQTIaUktIS0rR8t7nIRWa+UE5Rdj4DzM9d1D6rPiaqVmAFKm124luxGViAN+a3vbQzzCLPU9QsQ6Y2mFzWc5XsM2jat7hoDflaTTguAcLSraqhVbpqj2OAcGk45D55HnsuwwhFOyvnSIQhCJQhCEhQjhCESiYaeEcIUrknWzqJ+x0HxC1u0ylRYqKeUMbXJuc5zFRbTcm+k8YFnbuvmBavgaiq5XJaow5OqXJU/wAXvUTibjXaczUtDHAAL2HhNV+oouqVHSeKPsOQhZUsElR95nNW8Ye4tNYWXYqcLwADjoq1rbiZe0087ZZlCecxMvIiTIKx+W5gkbrIrTM9MtS0OXX6Sp2PvloITlT1csiwutmgXOBa4WiLdVqnwmV8xN8z5jf2eX8ps2pXVQvDrxN9mx/tKmKvma6W+zfPp3QfpMi1rLaZHEmFp0PKpPe0ix7g/wCxPus1Gimp10uc39pUxWPHZ3vLWEqAjybQzBiKVNbHsxwtwt5yrYn6llrF3kTSIaCDOff25+611DDNUtqoDa/2lxU7NxwnJTXTNl4nP6zSytFM58V9aOthgSCTol2b7Vu6vzlzUkxstajoTTbxN/dOZ5d8AG52gbpUarHkZcyXlWk5Ju0ys8wnK6mnfDPqM90mEgJK8jaQofcyFMGek6k1MR+0gYfNxELVsFIWnmUkk2Nl0Hynm1+c6b6M8JXXM7ZxRdSVGbhZyVtoDoQL3mWi3ieB8LU8U1Ao6RzjB2h2D2GCRmF72EDCdkL5ylCEIUohCEKIUI4XhIRKEcUlSFU6YwbVqD0lcKai5SxGewPeG43Fx8Zx7rV1dfAOoZw/aAMpAy63sVtc7afOdtnifSL0LXxPZtRplxTDBrHi1Nxwk6jfb+k1dVSDm8QF12vBNaaVcUnOAYZJmBfhtf05xO11ykiILL3SHRlagQKtJqeYXUEMlxtcSlacwyF676XQ4XB3GCsiTMCPAH6yuGk1MAwtulUGFksL90CNGAMxSLHhgulX4wy4Cw9LUjcOLezKNWm4W83NSpmF9LzBnmQVCNlztXpab6hfxETy5rS4ZqiHh18Q2s9BTrXAYA8S92VUogG4Eb0t7GTUeHFU0VOppWm8jlOOo/zsog2dpKqc2nKMUxJ5ZjJCytY4tIOCVjp6TLY+Ei1M8pJXI3EjKyUxw/SZA2SEQaZqVUAXlalvAV3w3hg5+y2HRuEavVSkmrVCAvhcnc+A8523q30X+y4ZKRC596hBvmY8/M2sL+U8P6POh6VaoK2arTq0CpKqVAa+xudbECzctftWHTDOhpKYA4/ZeT8e1z3uGnwBcjrt6QQQlCOE3V51KEcUIiEIQijFHFChEcUcKUoRxQVC0fXHoX9rwxVVvVTipaquuxW55Ee7UCcax2GNGo9NrZqZZWtqLgkGx56ifQYmq6R6u4WvmNShTJbvOoyNfxzC1z75qV9P5h4hldrwzxf+EaaTwS2ZtkG0523iy4RJCes61dSKmGvUpk1KetyBxIOWdRytzGnkJ5pcI98qqTwjYE6FQQbfiE57qbm2IXrdNqaVaHU3SD9oiQeRuM+ixXhU7hhU00Oh58re+YyLpY+sy/nKAXW052WjkVC5AH2o8Sul5lqnNcW0MxIM2nhLDmsD25pi8i3cLBTrzOtQGY2wY85A3BsfhL2dha4NWlZ6sKwv5TJXrIoIAueUwUiDNx0V0A+MLLSALKjPYmxsthwab3I3tKAfVCz+cW0XPkCNzstVSqXHEPlM9FSSRr3TKrUjTJUgggkEHQgjkROs+jvozC1cMtU0FNWmxVma7XI4hlBNhvbbcTJTp8boCwVtd/CUfNqNJiBaN+fxg3OFrKPo4Z8Kj5wtYi7KxzKQdQLgXDWOu4/OR6s+j6oKwfEgBKZuVLBjU8BwkgC9r315c9Onwm//AA1OV5M+Nassc0kX3i7Z2afiQSNioUaKqLKqqAAAAAosNhpykjHCZ5XKRIyUUsoShHFClEIQhFCOKEhQiOEUlEQhCVUJx2ijhSmJXxtBjTqCkezd0ZUcHLlNjlN/eZYjhSLGVwPpboTFUWbtaNRRe5JQ5f3hcH5zX1MOyhSVazXytYhSRbNlOxtcX98+jJ4H0hFWr0qdluiE6jkx0H0M0X6XhFivQj9RHNWn3g/APXqvA9E4A16iURoajgX3tc7zBjsDUwtUipTdSN1YWv5g7W8xpPddSOjUGKVgp4QzG9vDS3hvN76SsCKmCZrDNSYEGwJsbgj3G4PwExjTHgJ3W2f1HRfqGlginAEkQQb3GZFwDzi3Xiz1Sx4m39WZSLpa2qn6T1/UDq5h8azGsrnJ6oYKG273P5ETo2C6p4KjquGp3IIu96psRY/4hPIkS7dM49FR3jtATHE6bdPc3+y5F0J1UxWKXPSpDKpILFkAuADYXNybET3no66DxGGqO1eiyAoVRiye0hK2DE65b3ty857fBYSnRQU6SKiLsqiw13+MzTMzTNaQ45C5up8YqVWPpNaAx3eYscggTblHdaXpbqphMUxarQGY7lSyE+ZsbE+ZBl7ovo6nhqS0aQORb2uSx1N9/jLkJsBoBkBcx1ao5gYXEgYE2HYbeiIoQkrGiOKMQiIXkYSyJ3ihCERCEIRQjhCFCIo4pEoiEISEKJK8jJQiccQEcIlOY9Ya/bYyqfZORfcun53nSsTVyIzH1VJ+QvOY9D4dq9XTUu1/7+7eUfdYa14C9j1PwmVGe3eso9w3+p+ksdcUvgq3kt/lrNnhaApoqDZRb3+JlXrCmbCVh402/KTssgbDYXgvRYwFZ1B3X+k6cJyL0XYj/miDpcEfnOuyGYVaX7U4QhLrIiEIoUohCEIiOKEIkYRmKWCIhCEIlCOEIoQhHCIhCEKEoQhIRSEIowZCJ2hFJQpWHGUO0pul7Z1K/MTU9XOr64RTqGY6XAsAPAePvm7hIi8qpAmU5X6QTNSceKMPpLEjUFwR4gyVK4v1Fc08avgTb62/nO1CcRwgNHGfdqt9DO2UmuoPiBKMWKlhThCEusqIo4QpShCEIiEIQiRhAwlgiIQhCIhCEIoQhCFCcUcIRKEISNlCI44SFKJKEIRKEIQoRCOEKVxbpL/rKn/mb+KdjwP+En3R+UUJRqw08lWIoQl1mKcUIQpRCEIREIQhE5ExwkhEoQhJREIQhF//2Q==",
    studentId: 2071274,
    track1: "웹공학",
    skills: [{ name: "React", logo: "../../asset/image/react.png" }, { name: "C", logo: "../../asset/image/c.png" }, { name: "Javascript", logo: "../../asset/image/javascript.png" }],
    isApproved: false,
}
];

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface Application {
    // 유저 ID, 유저 닉네임, 필수/우대 사항 충족 여부, 프로필 사진, 학번, 1트랙, 관심 기술
    id: number,
    nickname: string,
    isMeetRequired: boolean,
    isMeetOptional?: boolean,
    profileImg: string,
    studentId: number,
    track1: string,
    skills: typeof skillData,

    isApproved: boolean; //추가되어야함
}

export const ApplicantList = ({ postingId }: { postingId: number }) => { //UI 확인용 임시.
    const [state, setState] = React.useState({
        right: false,
    });
    const [dense, setDense] = React.useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [collapseOpen, setCollapseOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`/api/recruit/${postingId}/applicants`);
                if (response.status === 200) {
                    setApplications(Array.from(new Set(Array.from(response.data))));
                    console.log(`서버에서 받아온 신청자 목록 확인하기: ${JSON.stringify(applications)}  ${typeof applications}`);
                    // setApplications(Array.from(new Set(Array.from(dummy))));
                    // console.log(`서버에서 받아온 신청자 목록 확인하기: ${JSON.stringify(applications)}  ${typeof applications}`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchApplicants();
    }, [postingId]);

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const putApprove = (targetId: number) => {
        axios({
            method: "put",
            url: `/api/recruit/${postingId}/approval/${targetId}`,
        })
            .then((res) => {
                if (res.status === 200) {
                    alert(`승인되었습니다.`);
                }
            })
            .catch((err) => console.log(err));
    }

    const putReject = (targetId: number) => {
        alert(`${targetId} 승인취소되었습니다.`);
        // axios({
        //     method: "put",
        //     url: `/api/recruit/${postingId}/reject/${targetId}`,
        // })
        //     .then((res) => {
        //         if (res.status === 200) {
        //             alert(`승인취소되었습니다.`);
        //         }
        //     })
        //     .catch((err) => console.log(err));
    }

    return (
        <div>
            {(["right"] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Tooltip title="신청자 목록">
                        <IconButton onClick={toggleDrawer(anchor, true)}>
                            <FolderSharedOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} PaperProps={{ sx: { width: "50%" } }} >
                        <Box>
                            <List dense={dense}>
                                <ListSubheader>
                                    신청자 목록
                                </ListSubheader>
                                {applications.map((app) => (
                                    <ListItem key={app.id}>
                                        <ListItemAvatar><Avatar srcSet={app.profileImg} variant="rounded" /></ListItemAvatar>

                                        <ListItemText primary={app.nickname} secondary={`학번: ${app.studentId.toString().slice(0, 2)}`} />
                                        <ListItemText primary={app.isMeetRequired ? <Chip size="small" variant="outlined" label="👌" /> : <Chip size="small" variant="outlined" label="❌" />} secondary={(typeof app.isMeetOptional !== undefined && app.isMeetOptional === true) ? <Chip size="small" variant="outlined" label="👌" /> : <Chip size="small" variant="outlined" label="❌" />} />
                                        <ListItem>
                                            <ListItemButton onClick={() => setCollapseOpen(!collapseOpen)}>{collapseOpen ? <ExpandLess /> : <ExpandMore />}</ListItemButton>
                                            <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                                                {/* 신청자 정보 */}
                                                {/* 1트랙, 2트랙 */}
                                                <Typography>{app.track1}</Typography>
                                                <Typography>{/*app.track2*/}</Typography>
                                                {/* 선택한 기술 */}
                                                {app.skills?.map(skill => <Chip label={skill.name}></Chip>)}
                                                {/* 자기소개 */}
                                                <Typography>{/*app.introduce*/}</Typography>
                                            </Collapse>
                                        </ListItem>


                                        {(!app.isApproved) ? <>
                                            <Tooltip title="승인대기">
                                                <IconButton edge="end" aria-label="approve" onClick={() => putApprove(app.id)} >
                                                    <PersonAddOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                            : <><Tooltip title="승인완료"><IconButton edge="end" aria-label="reject" onClick={() => putReject(app.id)} >
                                                <PersonAddDisabledOutlinedIcon />
                                            </IconButton></Tooltip>
                                            </>}

                                    </ListItem>
                                ))}
                            </List>
                            <Tooltip title="닫기">
                                <IconButton onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                                    < DisabledByDefaultOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Drawer>
                </React.Fragment >
            ))
            }
        </div >
    );
}