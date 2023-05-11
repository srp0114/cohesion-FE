import { useState } from "react"
import { Grid, TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/AddOutlined';

interface MySummary {
    onAddSummary: (content:string) => void;
}

const MySummaryField = ({onAddSummary} : MySummary) => {
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const handleSummary = () => {
        content.trim() === '' ? 
        setError(true) : 
        setError(false);
        onAddSummary(content);
        setContent("")
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setContent(e.target.value)
    }

    return (
        <>
        <Grid container item spacing={2} direction="row" sx={{ p:"0 1rem 1.5rem", mt:"0.5rem", display:"flex", justifyContent:"space-between"}} >
        <Grid item xs={11} md={11}>
            <TextField 
                className="summaryField"
                placeholder="오늘의 공부기록을 남겨주세요!"
                multiline
                value={content}
                onChange={handleChange}
                error={error}
                helperText={error ? "공부기록을 입력해주세요" : ""}
            />
        </Grid>
        <Grid item xs={1} md={1}>
            <IconButton className="summaryButton" onClick={handleSummary}><AddIcon/></IconButton>
        </Grid>
        </Grid>
        </>
    )
}

export default MySummaryField;