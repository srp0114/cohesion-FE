import { useRef, useState } from "react"; 
import { Grid, Stack, Typography, Button } from "@mui/material";

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
      <Button variant="contained" component="label"> 파일 첨부하기
        <input ref={inputRef} hidden type="file" multiple onChange={handleChange} />
      </Button>
      {file.map((file, index) => (
        <Stack direction="row" spacing={6}>
        <Typography key={`${file.name}_${index}`}>
          {file.name}
          <Button onClick={() => handleDelete(index)}>삭제</Button>
        </Typography>
        </Stack>
      ))}
    </Grid>
  );
};

export default AddFile;