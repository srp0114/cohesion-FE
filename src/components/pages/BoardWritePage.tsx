import React, { useState } from "react";
import Header from "../layout/Header";
import {
  SelectChangeEvent,
  Select,
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Point from "../layout/Point";
import Language from "../layout/Language";
import EditorToolbar from "../layout/EditorToolbar";
/*
 * 기본 게시글 작성 UI폼
 */
const BoardWrite = () => {
  const [boardType, setBoardType] = React.useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [point, setPoint] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");

  //내용, 포인트 , 언어 컴포넌트로부터 데이터 받아오기
  const getContent = (value: string) => {
    setContent(value);
  };

  const getPoint = (point:number): void => {
    setPoint(point*10);
  };

  const getLanguage = (value: string) => {
    setLanguage(value);
  }
  
  const fileList : File[] = [];

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setBoardType(event.target.value as string);
  };


  const onSaveFiles = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const files: FileList | null = e.target.files;
    const fileArray = Array.prototype.slice.call(files);

    fileArray.forEach((file)=>{
      fileList.push(file);
    });
  };

  const handleInputClick = async () => {


    const request_data = {
      title: title,
      content: content
    };

    const request_qna = {
      title: title,
      content: content,
      point : point,
      language : language
    };

    const qna_formData = new FormData();
    fileList.forEach((file)=>{
      qna_formData.append('multipartFiles',file);
    });
    qna_formData.append('stringQna',JSON.stringify(request_qna));

    if (boardType === "free") { // 자유 게시판인 경우
      try {
        let response = await axios({
          method: "post",
          url: "/api/freeBoards?uid=100", // 테스트를 위해 id 고정
          headers: {"Content-Type": "application/json"},
          data: JSON.stringify(request_data)
        });
        console.log("writeBoard/response: ", response);
        console.log("writeBoard/response.status: ", response.status);
        window.location.href = "/";
      } catch (err) {
        console.log("CreateBoard/handleInput/err: ", err);
      }
    }  else if (boardType === "question") { // 자유 게시판인 경우

      try {
        if(fileList.length>0){
          let response = await axios({
            method: "post",
            url: "/api/qnaBoards/100", // 테스트를 위해 id 고정
            headers: {"Content-Type": "multipart/form-data"},
            data: qna_formData,
          });
          console.log("writeBoard/response: ", response);
          console.log("writeBoard/response.status: ", response.status);
        }else{
          let response = await axios({
            method: "post",
            url: "/api/qnaBoardsNoFile/100", // 테스트를 위해 id 고정
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(request_qna)
          });
          console.log("writeBoard/response: ", response);
          console.log("writeBoard/response.status: ", response.status);
        }
        window.location.href = "/";

      }catch (err) {
        console.log("CreateBoard/handleInput/err: ", err);
      }
    }
  };

  const SelectLanguage = (boardType==="question") ? (
      <Language getLanguage={getLanguage}/>
  ) : (null);

  const SelectPoint = (boardType==="question") ? (
      <Point getPoint={getPoint}/>
  ) : (null);

  return (
      <>
        <Container>
          <Header />
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={handleChange} size="small">
                  <MenuItem value={"free"} defaultChecked>
                    자유게시판
                  </MenuItem>
                  <MenuItem value={"question"}>Q&A게시판</MenuItem>
                  <MenuItem value={"recruit"}>구인게시판</MenuItem>
                  <MenuItem value={"notice"}>공지사항</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {SelectLanguage}
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
              <EditorToolbar getContent={getContent}/>
              {/* value: {content} */}
              <div>
                <input type="file" multiple onChange={onSaveFiles}/>
              </div>
            </Grid>

            {SelectPoint}
            <Grid item>
              <Button
                  className="board button"
                  variant="outlined"
                  disableElevation
                  onClick={handleInputClick}
              >
                게시
              </Button>
            </Grid>
          </Grid>
        </Container>
      </>
  );
};

/*
 * 구인 게시판에서 구인 조건을 작성할 때 사용
 */
const Condition = () => {
  return (
      <Grid container spacing={4} direction="column" justifyContent="space-around">
        <Grid item>
          <TextField
              required
              label="필수"
              placeholder="필수 조건을 기입하세요."
          ></TextField>
          <TextField
              label="우대 사항"
              placeholder="우대 사항을 기입하세요."
          ></TextField>
        </Grid>
      </Grid>
  );
};

export default BoardWrite;
