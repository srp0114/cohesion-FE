import React, { useEffect, useState, useRef } from "react";
import { Box, Container, TextField, Button, Grid, FormControl, FormHelperText, FormLabel, SelectChangeEvent, Select, Snackbar, MenuItem, Typography, ToggleButton, ToggleButtonGroup, IconButton, Stack } from "@mui/material";
import axios from "axios";
import Skill from "../layout/Skill";
import QuillEditor from "../layout/QuillEditor";
import { checkLogin } from "../checkLogin";
import { useLocation, useNavigate } from "react-router";
import "../style/Board.css";
import { BoardType } from "../model/board";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { FileItem } from "./Board/Free/FreeDetails";
import AddFile from "../layout/AddFile";
import { FindIcon } from "../data/IconData";
import Shorten from "../layout/Shorten";
import { useForm, Controller } from "react-hook-form";

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
    const [open, setOpen] = React.useState(false);
    const [postedFile, setPostedFile] = useState<FileItem[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { formState: { errors }, control, handleSubmit, setValue } = useForm({
        mode: "onChange",
        defaultValues: { title: "", content: "", party: 0, gathered: 0, required: "", optional: "" }
    });

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

    const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newPartyValue: number | null) => {
        if (newPartyValue !== null) {
            setParty(newPartyValue);
            getParty(newPartyValue);

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
            setGathered(newGatheredValue);
            getGathered(newGatheredValue);

            console.log(`사용자가 선택한 gathered 값: ${gathered}`);
        }
    };

    useEffect(() => {
        setBoardType(state);
        axios({
            method: "get",
            url: `/api/${state}/update/${postingId}`
        }).then(
            (res) => {
                if (res.status === 200) { //수정폼에 기존 내용 미리 넣어놓기
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

        // 첨부한 파일 리스트 출력을 위한 api 연동
        axios({
            method: "get",
            url: `/api/${state}/${postingId}/file-list`
        })
            .then((res) => {
                setPostedFile(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    useEffect(() => {
        setValue("title", title);
        setValue("content", content);
        setValue("party", party);
        setValue("optional", optional);
    }, [setValue, title, content, party, optional]);

    //내용, 포인트 , 언어 컴포넌트로부터 데이터 받아오기
    const getTitle = (value: string) => {
        setTitle(value);
    }

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

    const submitHandler = async () => {

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
        const free_formData = new FormData();
        const qna_formData = new FormData();
        const recruit_formData = new FormData();

        selectedFiles.forEach((file) => {
            free_formData.append("file", file);
        });
        selectedFiles.forEach((file) => {
            qna_formData.append("file", file);
        });
        selectedFiles.forEach((file) => {
            recruit_formData.append("file", file);
        });


        qna_formData.append("stringQna", JSON.stringify(request_qna));
        free_formData.append("stringFree", JSON.stringify(request_data));
        recruit_formData.append("stringRecruit", JSON.stringify(request_recruit));


        switch (boardType) {
            case BoardType.free:
                if (selectedFiles.length > 0) {
                    axios({
                        method: "put",
                        url: `/api/free/update/${postingId}/file`,
                        headers: { "Content-Type": "multipart/form-data" },
                        data: free_formData,
                    }).then((res) => {
                        if (res.status === 200) {
                            console.log(`수정에 성공했습니다!`);
                            nav(`/${boardType}/${postingId}`);
                        }
                    }).catch((err) => console.log(err));
                } else {
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
                }
                break;
            case BoardType.question:
                if (selectedFiles.length > 0) {
                    axios({
                        method: "put",
                        url: `/api/questions/update/${postingId}/file`,
                        headers: { "Content-Type": "multipart/form-data" },
                        data: qna_formData,
                    }).then((res) => {
                        if (res.status === 200) {
                            console.log(`수정에 성공했습니다!`);
                            nav(`/${boardType}/${postingId}`);
                        }
                    }).catch((err) => console.log(err));
                } else {
                    axios({
                        method: "put",
                        url: `/api/questions/update/${postingId}`,
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify(request_qna),
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                console.log(`수정에 성공했습니다!`); //추후 Snackbar로 변경. 북마크 등록/취소와 통일성 위해
                                nav(`/${boardType}/${postingId}`); //수정된 게시글 확인위해 해당 상세보기로
                            } // 응답(401, 403 등) 핸들링 ...
                        })
                        .catch((err) => console.log(err));
                }
                break;
            case BoardType.recruit:
                if (selectedFiles.length > 0) {
                    axios({
                        method: "put",
                        url: `/api/recruit/update/${postingId}/file`,
                        headers: { "Content-Type": "multipart/form-data" },
                        data: recruit_formData,
                    }).then((res) => {
                        if (res.status === 200) {
                            console.log(`수정에 성공했습니다!`);
                            nav(`/${boardType}/${postingId}`);
                        }
                    }).catch((err) => console.log(err));
                } else {
                    axios({
                        method: "put",
                        url: `/api/recruit/update/${postingId}`,
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify(request_recruit),
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                console.log(`수정에 성공했습니다!`); //추후 Snackbar로 변경. 북마크 등록/취소와 통일성 위해
                                nav(`/${boardType}/${postingId}`); //수정된 게시글 확인위해 해당 상세보기로
                            } // 응답(401, 403 등) 핸들링 ...
                        })
                        .catch((err) => console.log(err));
                }
                break;
            /* notice, summary 공지사항 혹은 마이페이지>공부기록 추가될 경우 이곳에 작성*/
            default:
                break;
        }
    };

    // 파일 삭제 api
    const deletePostedFile = (filename: string) => {
        axios({
            method: "delete",
            url: `/api/files/delete/${filename}`
        })
            .then((res) => {
                setPostedFile(postedFile.filter((value) => value.originalName !== filename));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // 첨부파일 리스트 길이가 0 이상인 경우 해당 파일 이름과 버튼
    const PostedFile = postedFile.length > 0 ? (
        <Grid item>
            {postedFile.map((value) => {
                return (
                    <>
                        <Stack direction="row" spacing={"1rem"} alignItems={"center"}>
                            <Typography variant="h4">{Shorten(value.originalName, 10)}</Typography>
                            <Typography>postedFile</Typography>
                            <IconButton onClick={() => deletePostedFile(value.originalName)}>
                                <FindIcon name="close" iconProps={{ fontSize: "small" }} />
                            </IconButton>
                        </Stack>
                    </>
                )
            })
            }
        </Grid>
    ) : (null)

    const SelectSkill = boardType === BoardType.question ? <Skill value={skill} getSkill={getSkill} /> : null;


    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Grid container direction="column" spacing={2} mt={"2.5rem"} mb={"2.5rem"}>
                        <>
                            <Grid item>
                                <FormControl style={{ minWidth: "130px" }}>
                                    <Select value={boardType} onChange={boardHandler} disabled>
                                        <MenuItem value={BoardType.free} defaultChecked>
                                            자유게시판
                                        </MenuItem>
                                        <MenuItem value={BoardType.question}>Q&A게시판</MenuItem>
                                        <MenuItem value={BoardType.recruit}>구인게시판</MenuItem>
                                        <MenuItem value={BoardType.notice}>공지사항</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item container direction={"row"} spacing={"1.5rem"}>
                                {SelectSkill}


                                <Grid item xs>
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
                                                }
                                            }}
                                            render={({ field: { value }, fieldState: { error } }) => (
                                                <TextField
                                                    fullWidth
                                                    onChange={(e) => {
                                                        setValue("title", e.target.value, { shouldValidate: true });
                                                    }}
                                                    value={value}
                                                    error={error !== undefined}
                                                    helperText={error ? error.message : ""}
                                                />
                                            )}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            {(boardType === BoardType.recruit) ? (
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
                                            rules={{ required: "모인 인원 수를 입력해주세요!" }}
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
                                                            disabled
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
                            <Grid item xs sx={{ width: "100%" }}>
                                <Controller
                                    control={control}
                                    name="content"
                                    rules={{ required: true }}
                                    render={({ field: { value } }) => (
                                        <div className="postQuill">
                                            <QuillEditor
                                                onAddQuill={(data) => {
                                                    const modifiedData = data.trim() === '<p><br></p>' ? "" : data;
                                                    setValue("content", modifiedData, { shouldValidate: true });
                                                    getContent(modifiedData);
                                                }}
                                                content={value}
                                            />
                                        </div>
                                    )}
                                />
                                <Box pl={"0.8rem"} pt={"0.2rem"}>
                                    {errors.content &&
                                        <Typography variant="h6" color="error.main">내용을 입력해주세요!</Typography>}
                                </Box>
                            </Grid>
                            {(boardType === BoardType.recruit) ? (
                                <>
                                    <Grid item container columnSpacing={2}>
                                        <Grid item xs={6}>
                                            <Controller
                                                control={control}
                                                name="required"
                                                render={({ fieldState: { error } }) => (
                                                    <>
                                                        <TextField
                                                            label="필수 조건"
                                                            placeholder="작성 예시) 이번 학기 000000 과목 A분반 수강생"
                                                            value={required}
                                                            onChange={(event) => {
                                                                setRequired(event.target.value);
                                                                getRequired(event.target.value);
                                                            }}
                                                            rows={3}
                                                            multiline
                                                            disabled
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
                            {PostedFile}
                            <AddFile handleFile={onSaveFiles} setSelectedFiles={setSelectedFiles} />

                            <Grid item container columnSpacing={2} sx={{ marginTop: 2 }} display={"flex"}
                                justifyContent={"flex-end"}>
                                <Grid item>
                                    <Button
                                        className="board button"
                                        variant="outlined"
                                        onClick={() => nav(`/${boardType}/${postingId}`)}
                                    >
                                        취소
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        className="board button"
                                        variant="contained"
                                        type="submit"
                                    >
                                        수정
                                    </Button>
                                </Grid>

                            </Grid>
                        </>
                    </Grid>
                </form>
            </Container>
        </>
    );
};

export default EditForm;