import { useRef, useState } from "react";
import { Grid, Stack, Typography, Button, Paper, IconButton } from "@mui/material";
import { FindIcon } from "../data/IconData";
import Shorten from "../layout/Shorten";

interface FileProps {
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFiles: (file: File[]) => void;
}

const AddFile = ({ handleFile, setSelectedFiles }: FileProps) => {
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
          <input ref={inputRef} hidden type="file" multiple onChange={handleChange} />
        </Button>
        {file.map((file, index) => (
          <Stack direction="row" alignItems={"center"} pt={"0.2rem"} pl={"2rem"} spacing={"0.5rem"}>
            <Typography key={index}>{Shorten(file.name, 10)}</Typography>
            <IconButton onClick={() => handleDelete(index)}>
              <FindIcon name="close" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

    </Grid>
  );
};
export default AddFile;