import React, { useEffect, useState } from "react";
import { Alert, Box, TextField, Button, Grid, FormControl, SelectChangeEvent, Select, Snackbar, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import EditorToolbar from "../layout/QuillEditor";
import { checkLogin } from "../checkLogin";
import { useNavigate } from "react-router";
import "../style/Board.css";
import { BoardType } from "../model/board";
import Loading from "../layout/Loading";
import { useForm, Controller } from "react-hook-form";

/*
 * 기본 게시글 작성 UI폼
 */
const PostNoticeForm = () => {
    const [boardType, setBoardType] = React.useState("notice");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const nav = useNavigate();
    const [open, setOpen] = React.useState(false);
    const[selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

        const request_notice = {
            title : title,
            content : content
        }

        const notice_formData = new FormData();

        selectedFiles.forEach((file)=>{
            notice_formData.append("file",file);
        });

        notice_formData.append("stringNotice",JSON.stringify(request_notice));


        if(boardType === BoardType.notice){
            if(selectedFiles.length >0){
                axios({
                    method : "post",
                    url : `/api/notice`,
                    headers :{ "Content-Type": "multipart/form-data" },
                    data : notice_formData,
                }).then((res)=>{
                    if(res.status === 200){
                        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                게시되었습니다.
                            </Alert>
                        </Snackbar>
                        window.location.href=`/${boardType}/${res.data}`;
                    }
                }).catch((err)=>{
                    if(err.response.status===401){
                        console.log("로그인 x");
                    } else if (err.response.status === 403) {
                        console.log("권한 x");
                    }
                });
            }else{
                axios({
                    method : "post",
                    url : `/api/${boardType}/no-file`,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(request_notice)
                }).then((res)=>{
                    if(res.status === 200){
                        //TODO : 해당 게시글 id 반환
                        // nav(`/${boardType}/${res.data}`)
                        window.location.href=`/${boardType}/${res.data}`;
                    }
                }).catch((err)=>{
                    if(err.response.status===401) {
                        console.log("로그인x");
                    }else if(err.response.status===403){
                        console.log("권한x");
                    }
                });


            }



        }


        setOpen(true);
        return (
            <>
                {isLoading && <Loading delayTime={1500} />}
            </>
        );
    };

    const {  formState: { errors }, control, handleSubmit, setValue } = useForm({ mode: "onChange" });



    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <FormControl style={{ minWidth: 150}}>
                            <Select value={boardType} onChange={boardHandler}>
                                <MenuItem value={BoardType.notice} defaultChecked>공지사항</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
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
                    <Grid item>
                        <Controller
                            control={control}
                            name="content"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <div className="postQuill">
                                    <EditorToolbar
                                        onAddQuill={(data) => {
                                            const modifiedData = data.trim() === '<p><br></p>' ? "" : data;
                                            setValue("content", modifiedData, { shouldValidate: true });
                                            console.log(modifiedData)
                                            getContent(modifiedData);
                                        }}
                                        content={field.value}
                                    />
                                </div>
                            )}
                        />
                        <div>
                            <input type="file" multiple onChange={onSaveFiles} />
                        </div>
                        <Box pl={"0.8rem"} pt={"0.2rem"}>
                            {errors.content && <Typography variant="h6" color="error.main">내용을 입력해주세요!</Typography>}
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" type="submit">작성하기</Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default PostNoticeForm;
