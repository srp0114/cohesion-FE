import React, { useState } from 'react';
import {
    Grid, FormControl, Select, SelectChangeEvent, Avatar, MenuItem, Box } from "@mui/material";
import { skillData } from "../data/SkillData";

interface SkillProps {
  getSkill: any;
}
  
const Skill: React.FC<SkillProps>= ({getSkill}) => {

  const [skill, setSkill] = useState<string>("");

  const onSelectSkill = (event: SelectChangeEvent) => {
    setSkill(event.target.value)
    getSkill(event.target.value)
  }

  return (
    <Grid item>
      <FormControl sx={{ width: 250 }}>
        <Select
          placeholder='질문 기술을 선택해주세요'
          value={skill} 
          onChange={onSelectSkill}
          renderValue={(selected) => (
            <Box >
              {selected}
            </Box>
          )}
          >
            {skillData.map((value) => (
            <MenuItem value={value.name}>
              <Avatar sx={{ width: 30, height: 30, ml:2, mr:3 }} src={value.logo}/> {value.name}
            </MenuItem>
          ))}
            
        </Select>
      </FormControl>
    </Grid>
  );
}

export default Skill;