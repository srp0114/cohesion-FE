import { useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Stack, IconButton, TextField, Grow, Slide, FormControlLabel } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchField = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [showField, setShowField] = useState<boolean>(false);
    const containerRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSearch = () => {
        if (showField && searchInput.trim() !== "") {
            setSearchParams({query: searchInput});
            navigate(`/search?query=${searchInput}`);
            window.location.reload();
        } else {
            setShowField(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput.trim() !== "") {
            searchParams.set("query", searchInput);
            navigate(`/search?query=${searchInput}`);
            window.location.reload();
        }
    };

    return (
        <>
        <Stack direction="row" alignItems="center" mr={"0.8rem"} ref={containerRef}>
        <FormControlLabel control={    
        <IconButton onClick={handleSearch}>
            <SearchIcon />
        </IconButton>} label={null}/>
        {showField ? (
        <Slide direction="left" in={showField} container={containerRef.current} timeout={1000}>
            <TextField
            placeholder="검색어를 입력해주세요"
            variant="standard"
            InputProps={{ disableUnderline: true}}
            defaultValue={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            />
        </Slide>
        ) : (null)}
        </Stack>
        </>
    )
}

export default SearchField;
