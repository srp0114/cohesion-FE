import axios from "axios";
import { Typography, Stack, Button } from "@mui/material";
import { FileItem } from "../pages/Board/Free/FreeDetails";

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
        console.log(url, response, blob, link)
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <>
        {fileList.map((value) => (
            <Stack direction="row" gap={6} ml={"2rem"} >
            <Typography variant="h5">{value.originalName}</Typography>
            <a href={`/api/files/download/${value.originalName}`}>{value.originalName}</a>
            <Button onClick={() => downloadFile(value.originalName)} size="small">다운로드</Button>
            </Stack>
        ))}
        </>
    );
};

export default File;
