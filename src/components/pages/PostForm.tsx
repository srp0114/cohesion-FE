import React, { useEffect, useState, useRef } from "react";
import { Alert, Box, Container, TextField, Button, Grid, FormControl, SelectChangeEvent, Select, Snackbar, MenuItem, Typography, Stack } from "@mui/material";
import axios from "axios";
import AddFile from "../layout/AddFile";
import Skill from "../layout/Skill";
import QuillEditor from "../layout/QuillEditor";
import People from "../layout/People";
import { ConditionRequired, ConditionOptional } from "../layout/Condition";
import { checkLogin } from "../checkLogin";
import { useNavigate } from "react-router";
import "../style/Board.css";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { BoardType } from "../model/board";
import Loading from "../layout/Loading";
import { useForm, Controller } from "react-hook-form";
import Shorten from "../layout/Shorten";

/*
 * 기본 게시글 작성 UI폼
 */
const PostForm = () => {
  const [boardType, setBoardType] = React.useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [skill, setSkill] = useState<string>("");
  const [required, setRequired] = useState<string>("");
  const [optional, setOptional] = useState<string>("");
  const [party, setParty] = useState<number>(0);
  const [gathered, setGathered] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);
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
        nav("/"); // 비로그인인 경우, 메인 페이지로 이동
      }
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
    setBoardType(event.target.value as string);
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
  const onSubmit = async () => {
    setIsLoading(true);
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
      title: title,
      content: content,
      required: required,
      optional: optional,
      party: party,
      gathered: gathered,
    };

    const qna_formData = new FormData();
    const free_formData = new FormData();
    const recruit_formData = new FormData();

    selectedFiles.forEach((file) => {
      free_formData.append("file", file);
    })

    selectedFiles.forEach((file) => {
      qna_formData.append("file", file);
    });

    selectedFiles.forEach((file) => {
      recruit_formData.append("file", file);
    })

    free_formData.append("stringFree", JSON.stringify(request_data));
    qna_formData.append("stringQna", JSON.stringify(request_qna));
    recruit_formData.append("stringRecruit", JSON.stringify(request_recruit));

    if (boardType === BoardType.free) {
      // 자유 게시판인 경우
      if (selectedFiles.length > 0) {
        axios({
          method: "post",
          url: `/api/free`,
          headers: { "Content-Type": "multipart/form-data" },
          data: free_formData,
        }).then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            nav(`/${boardType}/${res.data}`)
          } // 응답(401, 403 등) 핸들링 ...
        }).catch((err) => {
          console.log(err);
          if (err.response.status == 413) {
            alert("파일 용량이 큽니다!!");
          }
        });
      } else {
        axios({
          method: "post",
          url: `/api/${boardType}/no-file`,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(request_data),
        })
          .then((res) => {
            if (res.status === 200) {
              <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  게시되었습니다.
                </Alert>
              </Snackbar>
              nav(`/${boardType}/${res.data}`)
            } // 응답(401, 403 등) 핸들링 ...
          })
          .catch((err) => {
            console.log(err);
          });
      }

    } else if (boardType === BoardType.question) {
      // Q&A 게시판인 경우
      if (selectedFiles.length > 0) {
        axios({
          method: "post",
          url: "/api/questions",
          headers: { "Content-Type": "multipart/form-data" },
          data: qna_formData
        }).then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            nav(`/${boardType}/${res.data}`);
          } // 응답(401, 403 등) 핸들링 ...
        }).catch((err) => {
          if (err.response.status === 401) {
            console.log("로그인 x");
          } else if (err.response.status === 403) {
            console.log("권한 x");
          } else if (err.response.status === 413) {
            alert("파일 용량이 큽니다!!");
          }
        });
      } else {
        axios({
          method: "post",
          url: "/api/questions/no-file",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(request_qna),
        })
          .then((res) => {
            if (res.status === 200) {
              // 성공 시 작업
              nav(`/${boardType}/${res.data}`)
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              console.log("로그인 x");
            } else if (err.response.status === 403) {
              console.log("권한 x");
            }
          });
      }
    } else if (boardType === BoardType.recruit) {
      // 구인 게시판인 경우
      if (selectedFiles.length > 0) {
        axios({
          method: "post",
          url: `/api/recruit`,
          headers: { "Content-Type": "multipart/form-data" },
          data: recruit_formData,
        }).then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            nav(`/${boardType}/${res.data}`);
          } // 응답(401, 403 등) 핸들링 ...
        }).catch((err) => {
          if (err.response.status === 401) {
            console.log("로그인 x");
          } else if (err.response.status === 403) {
            console.log("권한 x");
          } else if (err.response.status === 413) {
            alert("파일 용량이 큽니다!!!");
          }
        });
      } else {
        axios({
          method: "post",
          url: `/api/recruit/no-file`,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify(request_recruit)
        }).then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            nav(`/${boardType}/${res.data}`);
          }
        }).catch((err) => {
          if (err.response.status === 401) {
            console.log("로그인 x");
          } else if (err.response.status === 403) {
            console.log("권한 x");
          } else if (err.response.status === 413) {
            alert("파일 용량이 큽니다!!!");
          }
        })
      }
    }
    setOpen(true);
  };

  const { formState: { errors }, control, handleSubmit, setValue } = useForm({ mode: "onChange" });

  const SelectSkill =
    boardType === BoardType.question ? <Skill getSkill={getSkill} /> : null;

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={boardHandler}>
                  <MenuItem value={BoardType.free} defaultChecked>
                    자유게시판
                  </MenuItem>
                  <MenuItem value={BoardType.question}>Q&A게시판</MenuItem>
                  <MenuItem value={BoardType.recruit}>구인게시판</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item container direction={"row"} spacing={"1.5rem"}>
              {SelectSkill}
              {
                (boardType === BoardType.recruit) ? (
                  <>
                    <Grid item container columnSpacing={2}>
                      <ConditionRequired getRequired={getRequired} />
                      <ConditionOptional getOptional={getOptional} />
                    </Grid>
                    <People getParty={getParty} getGathered={getGathered} />
                  </>) : null
              }
              <Grid item xs>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: true }}
                  render={({ fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setValue("title", e.target.value, { shouldValidate: true });
                      }}
                      value={title}
                      placeholder="제목을 입력해주세요"
                      error={error !== undefined}
                      helperText={error ? "제목을 입력해주세요!" : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid item>
              <Controller
                control={control}
                name="content"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="postQuill">
                    <QuillEditor
                      onAddQuill={(data) => {
                        const modifiedData = data.trim() === '<p><br></p>' ? "" : data;
                        setValue("content", modifiedData, { shouldValidate: true });
                        getContent(modifiedData);
                      }}
                      content={field.value}
                    />
                  </div>
                )}
              />
              <Box pl={"0.8rem"} pt={"0.2rem"}>
                {errors.content && <Typography variant="h6" color="error.main">내용을 입력해주세요!</Typography>}
              </Box>
            </Grid>
            <AddFile handleFile={onSaveFiles} setSelectedFiles={setSelectedFiles} />
            <Grid item>
              <Button variant="outlined" type="submit">작성하기</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default PostForm;