import React, { useEffect, useState, useRef } from "react";
import { Alert, Container, TextField, Button, Grid, FormControl, SelectChangeEvent, Select, Snackbar, MenuItem, Typography, Stack } from "@mui/material";
import axios from "axios";
import Skill from "../layout/Skill";
import EditorToolbar from "../layout/EditorToolbar";
import People from "../layout/People";
import { ConditionRequired, ConditionOptional } from "../layout/Condition";
import { checkLogin } from "../checkLogin";
import { useLocation, useNavigate } from "react-router";
import "../style/Board.css";
import { BoardType } from "../model/board";
import Loading from "../layout/Loading";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { FileItem } from "./Board/Free/FreeDetails";
import AddFile from "../layout/AddFile";
/*
 * 기본 게시글 작성 UI폼
 */
const EditForm = () => {
  const [boardType, setBoardType] = useState<BoardType>(BoardType.free);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [required, setRequired] = useState<string>("");
  const [optional, setOptional] = useState<string>("");
  const [party, setParty] = useState<number>(0);
  const [gathered, setGathered] = useState<number>(0);
  const nav = useNavigate();
  const { state } = useLocation();
  const pathArray = window.location.href.split("/");
  const postingId = [...pathArray].pop();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [postedFile, setPostedFile] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    checkLogin().then((res) => {
      if (!res) {
        nav("/"); // 비로그인인 경우
      }
    });
  }, []);

  useEffect(() => {
    setBoardType(state);
    axios({
      method: "get",
      url: `/api/${state}/update/${postingId}`
    }).then(
      (res) => {
        if (res.status === 200) { //수정폼에 기존 내용 미리 넣어놓기
          console.log(`게시글 수정을 위한 정보 가져오기 ${JSON.stringify(res.data)}`);
          setTitle(res.data.title);
          setContent(res.data.content);
          // //Q&A게시판
          setSkill(res.data.language); //질문한 언어, 기술
          // //구인(모집) 게시판
          setRequired(res.data.required); //수정 불가
          setOptional(res.data.optional);
          setParty(res.data.party);
          setGathered(res.data.gathered); //수정 불가
        }
      }
    ).catch((err) => console.log(err));

    axios({
        method: "get",
        url: `/api/free/${postingId}/file-list`
    })
    .then((res) => {
        setPostedFile(res.data);
    })
    .catch((err) => {
        console.log(err);
    });
      
  }, []);

  //내용, 포인트 , 언어 컴포넌트로부터 데이터 받아오기
  const getContent = (value: string) => {
    setContent(value);
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
    setSelectedFiles(fileArray);
    fileArray.forEach((file) => {
      fileList.push(file);
    });
  };

  const submitHandler = async (event:React.MouseEvent) => {
    setIsLoading(true);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    axios({
      method: "post",
      url: "/api/files",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    })
    .then((res) => {
      if (res.status === 200) {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 413) {
        alert("파일 용량이 큽니다!!");
      }
    });

    const request_data = {
      title: title,
      content: content,

    };

    const request_qna = {
      title: title,
      content: content,
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
     * 게시판 종류에 맞는 HTTP PUT 요청 설정 (Update) 수정 기능
     */
    axios({
      method: "put",
      url: `/api/${boardType}/update/${postingId}`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(request_data),
    })
      .then((res) => {
        if (res.status === 200) {
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              수정되었습니다.
            </Alert>
          </Snackbar>
          nav(`/${boardType}/${postingId}`); //수정된 게시글 확인위해 해당 상세보기로
        } // 필요시 응답(401, 403 등) 에러 핸들링 ...
      })
      .catch((err) => console.log(err));
    setOpen(true);
    return (
      <>
        {isLoading && <Loading delayTime={1500} />}
      </>
    );

  };

  const deleteHandler = (event:React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    axios({
      method: 'delete',
      url: `/api/${boardType}/delete/${postingId}`
    }).then(
      (res) => {
        if (res.status === 200) {
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              삭제되었습니다.
            </Alert>
          </Snackbar>
          nav(`/${boardType}`); //삭제 후 게시판 목록페이지로
          setOpen(true);
        }
      }
    ).catch((err) => console.log(err));

    return (
      <>
        {isLoading && <Loading delayTime={1500} />}
      </>
    );

  }

  const deleteFile = (filename: string) => {
    axios({
        method: "delete",
        url: `/api/files/delete/${filename}`
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
  } 
  

  const SelectSkill =
    boardType === BoardType.question ? <Skill value={skill} getSkill={getSkill} /> : null;

  const DesignateConditionRequired =
    boardType === BoardType.recruit ? (
      <ConditionRequired value={required} getRequired={getRequired} />
    ) : null;
  const DesignateConditionOptional =
    boardType === BoardType.recruit ? (
      <ConditionOptional value={optional} getOptional={getOptional} />
    ) : null;
  const DesignatePeople = boardType === BoardType.recruit ? <People partyValue={party} gatheredValue={gathered} getParty={getParty} getGathered={getGathered} /> : null;
  
  const PostedFile = postedFile.length > 0 ? (
    <Grid item>
      {postedFile.map((value) => {
        return (<Typography variant="h4">{value.originalName}</Typography>)
      })
    }
    </Grid>
  ) : (null)

  return (
    <>
      <Container>
        <Grid container direction="column" spacing={2}>
          <>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={boardHandler} size="small" disabled>
                  <MenuItem value={BoardType.free} defaultChecked>
                    자유게시판
                  </MenuItem>
                  <MenuItem value={BoardType.question}>Q&A게시판</MenuItem>
                  <MenuItem value={BoardType.recruit}>구인게시판</MenuItem>
                  <MenuItem value={BoardType.notice}>공지사항</MenuItem>
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
                <EditorToolbar content={content} onAddQuill={getContent} />
              </div>
            </Grid>
            
            {PostedFile}
            <AddFile handleFile={onSaveFiles} setSelectedFiles={setSelectedFiles} />

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