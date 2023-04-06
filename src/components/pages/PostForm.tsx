import React, { useState } from "react";
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

/*
 * 기본 게시글 작성 UI폼
 */
const PostForm = () => {
  const [boardType, setBoardType] = React.useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [point, setPoint] = useState<number>(0);
  const [skill, setSkill] = useState<string>("");
  const [required, setRequired] = useState<string>("");
  const [optional, setOptional] = useState<string>("");

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

  const boardHandler = (event: SelectChangeEvent<unknown>) => {
    setBoardType(event.target.value as string);
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

    const qna_formData = new FormData();

    fileList.forEach((file) => {
      qna_formData.append("multipartFiles", file);
    });

    qna_formData.append("stringQna", JSON.stringify(request_qna));

    if (boardType === "free") {
      // 자유 게시판인 경우
      try {
        let response = await axios({
          method: "post",
          url: "/api/freeBoards", // 테스트를 위해 id 고정
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(request_data),
        });
        console.log("writeBoard/response: ", response);
        console.log("writeBoard/response.status: ", response.status);
        window.location.href = "/";
      } catch (err) {
        console.log("CreateBoard/handleInput/err: ", err);
      }
    } else if (boardType === "question") {
      // Q&A 게시판인 경우
      try {
        if (fileList.length > 0) {
          let response = await axios({
            method: "post",
            url: "/api/qnaBoards",
            headers: { "Content-Type": "multipart/form-data" },
            data: qna_formData,
          });
          console.log("writeBoard/response: ", response);
          console.log("writeBoard/response.status: ", response.status);
        } else {
          let response = await axios({
            method: "post",
            url: "/api/qnaBoardsNoFile",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_qna),
          });
          console.log("writeBoard/response: ", response);
          console.log("writeBoard/response.status: ", response.status);
        }
        window.location.href = "/";
      } catch (err) {
        console.log("CreateBoard/handleInput/err: ", err);
      }
    } else if (boardType === "recruit") {
      // 구인 게시판인 경우
    }
  };

  const SelectSkill =
    boardType === "question" ? <Skill getSkill={getSkill} /> : null;

  const SelectPoint =
    boardType === "question" ? <Point getPoint={getPoint} /> : null;

  const DesignateConditionRequired =
    boardType === "recruit" ? <ConditionRequired getRequired={getRequired}/> : null;
  const DesignateConditionOptional =
    boardType === "recruit" ? <ConditionOptional getOptional={getOptional}/> : null;
  const DesignatePeople = boardType === "recruit" ? <People /> : null;

  return (
    <>
      <Container>
        <Grid container direction="column" spacing={2}>
          <>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={boardHandler} size="small">
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
              <EditorToolbar getContent={getContent} />
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
                게시
              </Button>
            </Grid>
          </>
        </Grid>
      </Container>
    </>
  );
};

export default PostForm;
