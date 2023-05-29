import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material" 

interface SortProps {
    setSort : (sort:string) => void; 
    sort : string;
}

const SortBoard = ({sort, setSort} : SortProps) => {

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
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