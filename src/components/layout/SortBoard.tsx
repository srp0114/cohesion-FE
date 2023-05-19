import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material" 

interface SortProps {
    setBoardSort : (sort:string) => void; 
}

const SortBoard = ({setBoardSort} : SortProps) => {
  const [sort, setSort] = useState("createdAt,desc");

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
    setBoardSort(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 110 }} size="small">
      <InputLabel/>
      <Select
        value={sort}
        onChange={handleChange}
      >
        <MenuItem value={"createdAt,desc"}>최신순</MenuItem>
        <MenuItem value={"views,desc"}>조회순</MenuItem>
        <MenuItem value={"bookmarks"}>북마크순</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SortBoard;