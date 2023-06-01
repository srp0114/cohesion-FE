import React, { useEffect, useState, useRef } from "react";
import {
  Alert, Box, Container, TextField, Button, Grid, FormControl, FormHelperText,
  FormLabel, SelectChangeEvent, Select, Snackbar, MenuItem, Typography, Stack, ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import AddFile from "../layout/AddFile";
import Skill from "../layout/Skill";
import QuillEditor from "../layout/QuillEditor";
import { checkLogin } from "../checkLogin";
import { useNavigate } from "react-router";
import "../style/Board.css";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { BoardType } from "../model/board";
import { useForm, Controller } from "react-hook-form";
import { FindIcon } from "../data/IconData";

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
  const [party, setParty] = useState<number>(11);
  const [gathered, setGathered] = useState<number>(0);
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

  const changeParty = (party: React.SetStateAction<number>) => {
    setParty(party);
  }

  const changeGathered = (gathered: React.SetStateAction<number>) => {
    setGathered(gathered);
  }

  useEffect(() => {
    if (required) setRequired(required);
  }, [required]);

  useEffect(() => {
    if (optional) setOptional(optional);
  }, [optional]);

  useEffect(() => {
    if (party !== null && !!party) {
      setParty(party);
    }
    if (gathered !== null && !!gathered) {
      setGathered(gathered);
    }
  }, [party, gathered]);

  useEffect(()=>{
    console.log(`${JSON.stringify(party)}`);
  },[party]);

    useEffect(()=>{
    console.log(`${JSON.stringify(gathered)}`);
  },[gathered]);

  const [gatheredButtons, setGatheredButtons] = React.useState<Array<{ value: number; disabled: boolean }>>([
    { value: 1, disabled: false },
    { value: 2, disabled: false },
    { value: 3, disabled: false },
    { value: 4, disabled: false },
    { value: 5, disabled: false },
    { value: 6, disabled: false },
    { value: 7, disabled: false },
    { value: 8, disabled: false },
    { value: 9, disabled: false },
  ]);

  useEffect(() => {
    getParty(party);
    getGathered(gathered);
  }, [party, gathered]);

  useEffect(() => { setGathered(1); }
    , [party]);

  const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newPartyValue: number | null) => {
    if (newPartyValue !== null) {
      changeParty(newPartyValue);
      getParty(newPartyValue);
      setValue("party", party, { shouldValidate: true });

      const disabledRange = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const isDisabled = (value: number) => value >= newPartyValue;

      const updatedGatheredButtons = disabledRange.map((value) => ({
        value,
        disabled: isDisabled(value),
      }));

      setGatheredButtons(updatedGatheredButtons);
      console.log(`사용자가 선택한 party 값: ${party}`);
    }
  };

  const handleGatheredChange = (event: React.MouseEvent<HTMLElement>, newGatheredValue: number | null) => {
    if (newGatheredValue !== null) {
      changeGathered(newGatheredValue);
      getGathered(newGatheredValue);
      setValue("gathered", gathered, { shouldValidate: true });

      console.log(`사용자가 선택한 gathered 값: ${gathered}`);
    }
  };

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
          <Grid container direction="column" spacing={2} mt={"2.5rem"} mb={"2.5rem"}>
            <Grid item>
              <FormControl style={{ minWidth: "130px" }}>
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
              <Grid item xs>
                <Controller
                  control={control}
                  name="title"
                  rules={{
                    required: "제목을 입력해주세요!",
                    maxLength: {
                      value: 30,
                      message: "최대 30자까지 입력이 가능합니다."
                    },
                    minLength: {
                      value: 3,
                      message: "최소 3자 이상 입력해주세요!"
                    },
                  }}
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
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              {
                (boardType === BoardType.recruit) ? (
                  <Grid item container xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Grid item>
                      <Controller
                        name="party"
                        control={control}
                        rules={{
                          required: "총 인원 수를 입력해주세요!",
                          min: {
                            value: gathered,
                            message: "총 인원은 현재까지 모인 인원수보다 작을 수 없습니다"
                          }
                        }}
                        render={({ field }) => (
                          <>
                            <FormLabel component="legend" required>총 인원</FormLabel>
                            <FormControl fullWidth>
                              <ToggleButtonGroup
                                exclusive
                                value={party}
                                onChange={handlePartyChange}
                                sx={{ borderRadius: "20px" }}
                              >
                                <ToggleButton value={2}>2</ToggleButton>
                                <ToggleButton value={3}>3</ToggleButton>
                                <ToggleButton value={4}>4</ToggleButton>
                                <ToggleButton value={5}>5</ToggleButton>
                                <ToggleButton value={6}>6</ToggleButton>
                                <ToggleButton value={7}>7</ToggleButton>
                                <ToggleButton value={8}>8</ToggleButton>
                                <ToggleButton value={9}>9</ToggleButton>
                                <ToggleButton value={10}>10</ToggleButton>
                              </ToggleButtonGroup>

                            </FormControl>
                            <FormHelperText error={!!errors.party}>
                              {typeof errors.party?.message === "string" && errors.party.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="gathered"
                        control={control}
                        rules={{
                          required: "모인 인원 수를 입력해주세요!",
                          max: {
                            value: party - 1,
                            message: "모인 인원수는 총 인원보다 작아야 합니다.!"
                          }
                        }}
                        render={({ field }) => (
                          <>
                            <FormLabel component="legend" required>모인 인원</FormLabel>
                            <FormControl>
                              <ToggleButtonGroup
                                exclusive
                                {...field}
                                value={gathered}
                                onChange={handleGatheredChange}
                                sx={{ borderRadius: "20px" }}
                              >
                                {gatheredButtons.map((button) => (
                                  <ToggleButton
                                    key={button.value}
                                    value={button.value}
                                    disabled={button.disabled}
                                  >
                                    {button.value}
                                  </ToggleButton>
                                ))}
                              </ToggleButtonGroup>

                              <FormHelperText error={!!errors.gathered}>
                                {typeof errors.gathered?.message === "string" && errors.gathered.message}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item sx={{ display: "flex", flexDirection: "row-reverse", textAlign: "center" }}>
                      <Stack direction="row">
                        <Typography variant="h3">{`${Number(gathered)} / ${Number(party)}`}</Typography> <Typography variant="body1">{`(명)`}</Typography><FindIcon name="recruitPeople" />
                      </Stack>
                    </Grid>
                  </Grid>
                ) : null
              }
            </Grid>

            <Grid item xs sx={{ width: "100%" }}>
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
            {
              (boardType === BoardType.recruit) ? (
                <>
                  <Grid item container columnSpacing={2}>
                    <Grid item xs={6}>
                      <Controller
                        control={control}
                        name="required"
                        rules={{ required: true }}
                        render={({ fieldState: { error } }) => (
                          <>
                            <TextField
                              label="필수 조건"
                              placeholder="작성 예시) 이번 학기 000000 과목 A분반 수강생"
                              value={required}
                              onChange={(event) => {
                                setRequired(event.target.value);
                                getRequired(event.target.value);
                                setValue("required", event.target.value, { shouldValidate: true });
                              }}
                              rows={3}
                              multiline
                              error={error !== undefined}
                              helperText={error ? "필수 조건을 입력해주세요!" : ""}
                            />
                          </>
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="우대 조건"
                        placeholder="작성 예시) 깃허브 사용경험이 있으시면 좋습니다."
                        value={optional}
                        onChange={(event) => {
                          setOptional(event.target.value);
                          getOptional(event.target.value);
                        }}
                        rows={3}
                        multiline
                      />
                    </Grid>

                  </Grid>
                </>) : null
            }
            <AddFile handleFile={onSaveFiles} setSelectedFiles={setSelectedFiles} />
            <Grid item justifyContent={"flex-end"} display={"flex"}>
              <Button variant="contained" type="submit">작성하기</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default PostForm;