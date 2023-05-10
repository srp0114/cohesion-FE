import { useState } from "react"
import axios from "axios";
import { Grid, TextField, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/AddOutlined';

interface MySummary {
    onAddSummary: (content:string) => void;
}

const MySummaryField = ({onAddSummary} : MySummary) => {
    const [content, setContent] = useState<string>("");

    const handleSummary = () => {
        onAddSummary(content);
        setContent("");
    }

    return (
        <>
        <Grid container item spacing={2} direction="row" sx={{ p:"0 1rem 1.5rem", alignItems: "center", display:"flex", justifyContent:"center"}} >
        <Grid item xs={11} md={11}>
            <TextField 
                className="summaryField"
                placeholder="오늘의 공부기록을 남겨주세요!"
                multiline
                value={content}
                onChange={(e) => setContent(e.target.value)}
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