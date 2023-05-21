import { Grid, Box, Button } from "@mui/material";

interface FileProps {
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const File = ({ handleFile }: FileProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e);
  };

  return (
    <>
      <Grid item>
        <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
            <Button variant="contained" component="label">
                파일 첨부하기
                <input type="file" hidden onChange={handleChange} />
            </Button>
        </Box>
      </Grid>
    </>
  );
};

export default File;
