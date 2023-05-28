import axios from "axios";
import { Typography, Stack, Button } from "@mui/material";
import { FileItem } from "../pages/Board/Free/FreeDetails";
import { FindIcon } from "../data/IconData";

interface FileProps {
  fileList: FileItem[];
}

const File = ({ fileList }: FileProps) => {

    const downloadFile = async (filename: string) => {
        try {
            const url = `/api/files/download/${filename}`;
            const response = await axios.get(url, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error(err);
        }
    };

    //<a href={`/api/files/download/${value.originalName}`}>{value.originalName}</a>

    return (
        <>
            <Stack direction={"row"} ml={"1rem"} spacing={"1rem"} mb={"2rem"}>
                <Stack pt={"0.5rem"}>
                    <FindIcon name={"file"} iconProps={{ fontSize: "1rem" }} />
                </Stack>
                <Stack direction={"column"} spacing={"0.7rem"}>
                    {fileList.map((value) => (
                        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                        <Typography variant="h5">{value.originalName}</Typography>
                        <Button onClick={() => downloadFile(value.originalName)} size="small">다운로드</Button>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </>
    );
};

export default File;
