import { useState } from "react"
import { Grid, TextField, Button } from "@mui/material";

interface EditMySummaryProps {
    summaryId: number;
    content: string;
    editSummary: (summaryId:number, content:string) => void;
}

const MySummaryEditField = (props : EditMySummaryProps) => {
    const [content, setContent] = useState<string>(props.content);
    const summaryId = props.summaryId;

    const handleSummary = () => {
        props.editSummary(summaryId, content);
        setContent("");
    }

    return (
        <>
        <Grid container direction="row" spacing={2} sx={{alignItems:"center", justifyContent:"space-between", p:"0 1.5rem 0.5rem 1rem", display:"flex"}}>
        <Grid item xs={10} md={10}>
            <TextField 
                variant="standard" 
                className="summaryField"
                multiline
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{m:0}}
            />
        </Grid>
        <Grid item xs={1} md={1}>
            <Button onClick={handleSummary}>수정</Button>
        </Grid>
        </Grid>
        </>
    )
}

export default MySummaryEditField;