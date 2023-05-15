import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, IconButton, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Search from "../pages/Search";

const SearchField = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [showField, setShowField] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (showField) {
            navigate(`/search?query=${searchInput}`);
            window.location.reload();
        } else {
            setShowField(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            navigate(`/search?query=${searchInput}`)
            window.location.reload();
        }
    };

    return (
        <>
            <Grid container item direction={"row"}>
                <Grid item>
            { showField ? 
                <TextField 
                    variant="standard" 
                    value={searchInput}
                    defaultValue={searchInput}
                    onChange={(e)=>(setSearchInput(e.target.value))}
                    onKeyPress={handleKeyPress}
                /> : (null)
            }
            </Grid>
            <Grid>
            <IconButton onClick={handleSearch}>
                <SearchIcon/>
            </IconButton>
            </Grid>
            </Grid>
        </>
    )
}

export default SearchField;
