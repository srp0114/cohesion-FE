import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, IconButton, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchField = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [showField, setShowField] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleSearch = () => {
        if (showField && searchInput.trim() !== "") {
            navigate(`/search?query=${searchInput}`);
            window.location.reload();
        } else {
            setShowField(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput.trim() !== "") {
            navigate(`/search?query=${searchInput}`);
            window.location.reload();
        }
    };

    return (
        <>
            <Stack direction={"row"} alignItems={"center"} mr={"1rem"}>
            { showField ? 
                <TextField 
                    variant="standard" 
                    value={searchInput}
                    defaultValue={searchInput}
                    onChange={(e)=>(setSearchInput(e.target.value))}
                    onKeyPress={handleKeyPress}
                /> : (null)
            }
            <IconButton onClick={handleSearch}>
            <SearchIcon/>
            </IconButton>
            </Stack>
        </>
    )
}

export default SearchField;
