import { useRef, useState } from "react"; 
import { Grid, Stack, Typography, Button, Paper } from "@mui/material";

interface FileProps {
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFiles: (file:File[]) => void;
}

const AddFile = ({handleFile, setSelectedFiles} : FileProps) => {
  const [file, setFile] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(Array.from(e.target.files || []));
    handleFile(e);
  };

  const handleDelete = (index: number) => {
    const newFiles = [...file.slice(0, index), ...file.slice(index + 1)];

    const store = new DataTransfer();
    newFiles.forEach((file) => store.items.add(file));

    if (inputRef.current) {
      inputRef.current.files = store.files;
    }

    setFile(newFiles);
    setSelectedFiles(newFiles);
  };

  return (
    <Grid item>
      <Stack direction={"row"} alignItems={"flex-start"}>
        <Button variant="outlined" size="large" component="label"> 파일 첨부하기
          <input ref={inputRef} hidden type="file" multiple onChange={handleChange}/>
        </Button>
        <Stack direction={"column"} pt={"0.2rem"} pl={"2rem"} spacing={"0.5rem"}>
          {file.map((file, index) => (
            <Stack direction="row" spacing={"1rem"} alignItems={"center"}>
              <Typography key={index}>{file.name}</Typography>
              <Button onClick={() => handleDelete(index)}>삭제</Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Grid>
  );
};
export default AddFile;