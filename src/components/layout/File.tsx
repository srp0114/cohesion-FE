import { Typography } from "@mui/material";
import { FileItem } from "../pages/Board/Free/FreeDetails";

interface FileProps {
    fileList: FileItem[]
}

const File = ({fileList} : FileProps) => {
    
    return (
        <>
        {fileList.map ((value) => {
            return (
                <>
                <Typography variant="h5">{value.originalName}</Typography>
                </>
            )
        })}
        </>
    )
}

export default File;