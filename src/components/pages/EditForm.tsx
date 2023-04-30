import React, {useEffect, useState} from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  SelectChangeEvent,
  Select,
  MenuItem,
  Menu,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import Point from "../layout/Point";
import Skill from "../layout/Skill";
import EditorToolbar from "../layout/EditorToolbar";
import People from "../layout/People";
import { ConditionRequired, ConditionOptional } from "../layout/Condition";
import { checkLogin } from "../checkLogin";
import { Navigate, useNavigate } from "react-router";
import "../style/Board.css";
import { BoardType } from "../model/board";
import { isNumericLiteral } from "typescript";
import Loading from "../layout/Loading";

/*
 * 기본 게시글 작성 UI폼
 */
const EditForm = () => {
  const [boardType, setBoardType] = useState<BoardType>(BoardType.free);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [point, setPoint] = useState<number>(0);
  const [skill, setSkill] = useState<string>("");
  const [required, setRequired] = useState<string>("");
  const [optional, setOptional] = useState<string>("");
  const [party, setParty] = useState<number>(0);
  const [gathered, setGathered] = useState<number>(0);
  const [hasUserPoint ,setHasUserPoint] = useState<number>(0);
  const nav = useNavigate();

  const pathArray = window.location.href.split("/");
  const boardTypeArray = Object.values(BoardType);
  const initialBoardType = boardTypeArray.find((type) => pathArray.includes(type));
  const postingId = [...pathArray].pop();

  useEffect(() => {
    checkLogin().then((res) => {
      if (!res) {
        nav("/"); // 비로그인인 경우
      }
    });
  }, []);

  useEffect(()=>{
    axios({
      method : "get",
      url : `/api/user-info`
    }).then((res)=>{
      if(res.status===200){
        console.log(res.data.point);
        setHasUserPoint(res.data.point);
      }
    }).catch((err)=>{
      console.log(err);
    });
},[]);

    useEffect(()=>{ //id에 따른 게시글 정보 가져옴
        axios({
            method: "get",
            url: `/api/free/detail/${postingId}`
        }).then(
            (res)=>{
                if(res.status===200){ //수정폼에 기존 내용 미리 넣어놓기
                console.log(`게시글 수정을 위한 정보 가져오기 ${res.data.title} ${res.data.content}`);
                setTitle(res.data.title); //undefined로 나옴. 수정 필요
                setContent(res.data.content); //undefined로 나옴. 수정 필요
                }
            }
        ).catch((err) => console.log(err));
    },[]);


  //내용, 포인트 , 언어 컴포넌트로부터 데이터 받아오기
  const getContent = (value: string) => {
    setContent(value);
  };

  const getPoint = (point: number): void => {
    setPoint(point * 10);
  };

  const getSkill = (value: string) => {
    setSkill(value);
    console.log(value);
  };

  const getRequired = (value: string) => {
    setRequired(value);
  };

  const getOptional = (value: string) => {
    setOptional(value);
  };

  const getParty = (value: number) => {
    setParty(value);
  };

  const getGathered = (value: number) => {
    setGathered(value);
  };

  const boardHandler = (event: SelectChangeEvent<unknown>) => {
    setBoardType(event.target.value as string as BoardType);
  };

  const fileList: File[] = [];

  const onSaveFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const fileArray = Array.prototype.slice.call(files);

    fileArray.forEach((file) => {
      fileList.push(file);
    });
  };

  const submitHandler = async () => {
    const request_data = {
      title: title,
      content: content,
    };

    const request_qna = {
      title: title,
      content: content,
      point: point,
      language: skill,
    };

    const request_recruit = {
      title,
      content,
      required,
      optional,
      party,
      gathered
    }

    const qna_formData = new FormData();

    fileList.forEach((file) => {
      qna_formData.append("multipartFiles", file);
    });

    qna_formData.append("stringQna", JSON.stringify(request_qna));

    /**
     * 게시판 종류에 맞는 HTTP PUT 요청 설정 (Update)
     */
    switch(boardType){
        case BoardType.free:
            axios({
                method: "put", 
                url: `/api/free/update/${postingId}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(request_data),
              })
              .then((res) => {
                if (res.status === 200) {
                  console.log(`수정에 성공했습니다!`); //추후 Snackbar로 변경. 북마크 등록/취소와 통일성 위해
                  nav(`/${boardType}/${postingId}`); //수정된 게시글 확인위해 해당 상세보기로
                } // 필요시 응답(401, 403 등) 에러 핸들링 ...
              })
              .catch((err) => console.log(err));
            break;
        case BoardType.question:
            /*
            axios({
                method: "put", 
                url: `q&a게시판  게시글 수정 api`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(request_data),
              })
              .then((res) => {
                if (res.status === 200) {
                  // 성공 시 작업
                  window.location.href = "/";
                } // 응답(401, 403 등) 핸들링 ...
              })
              .catch((err) => console.log(err));
            */
            break;
        case BoardType.recruit:
             /*
            axios({
                method: "put", 
                url: `모집(구인)게시판  게시글 수정 api`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(request_data),
              })
              .then((res) => {
                if (res.status === 200) {
                  // 성공 시 작업
                  window.location.href = "/";
                } // 응답(401, 403 등) 핸들링 ...
              })
              .catch((err) => console.log(err));
            */
            break;
        /* notice, summary 공지사항 혹은 마이페이지>공부기록 추가될 경우 이곳에 작성*/
        default:
            break;
    }

  };

  const deleteHandler = () => {
    /*추후 qna, recruit 게시글 수정, 삭제 api 완성되면 추가해야함. */
    axios({
      method: 'delete',
      url: `/api/${boardType}/delete/${postingId}`
    }).then(
      (res) => {
        if(res.status === 200){
          console.log(`삭제 요청 완료 response.data ${res.data}`);
          <Loading delayTime={1500} />
          nav(`/${boardType}`);
        }
      }
    ).catch((err) => console.log(err));
  }

  const SelectSkill =
    boardType === BoardType.question ? <Skill getSkill={getSkill} /> : null;

  const SelectPoint =
    boardType === BoardType.question ? <Point getPoint={getPoint} /> : null;

  const DesignateConditionRequired =
    boardType === BoardType.recruit ? (
      <ConditionRequired getRequired={getRequired} />
    ) : null;
  const DesignateConditionOptional =
    boardType === BoardType.recruit ? (
      <ConditionOptional getOptional={getOptional} />
    ) : null;
  const DesignatePeople = boardType === BoardType.recruit ? <People getParty={getParty} getGathered={getGathered} /> : null;

  return (
    <>
      <Container>
        <Grid container direction="column" spacing={2}>
          <>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={boardHandler} size="small" disabled>
                  <MenuItem value={"free"} defaultChecked>
                    자유게시판
                  </MenuItem>
                  <MenuItem value={"question"}>Q&A게시판</MenuItem>
                  <MenuItem value={"recruit"}>구인게시판</MenuItem>
                  <MenuItem value={"notice"}>공지사항</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {SelectSkill}
            <Grid item>
              <TextField
                className="board title"
                id="board_title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxRows={1}
                placeholder={"제목"}
                fullWidth
              ></TextField>
            </Grid>
            <Grid item>
              <div className="postQuill">
                <EditorToolbar onAddQuill={getContent} />
              </div>
              {/* value: {content} */}
              <div>
                <input type="file" multiple onChange={onSaveFiles} />
              </div>
            </Grid>

            {SelectPoint}

            {DesignateConditionRequired}
            {DesignateConditionOptional}
            {DesignatePeople}

            <Grid item>
              <Button
                className="board button"
                variant="outlined"
                disableElevation
                onClick={submitHandler}
              >
                수정
              </Button>
              <Button
                className="board button"
                variant="outlined"
                disableElevation
                onClick={deleteHandler}
              >
                삭제
              </Button>
            </Grid>
          </>
        </Grid>
      </Container>
    </>
  );
};

export default EditForm;