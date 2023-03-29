import React, { useState } from 'react';
import {
    Grid,
    FormControl,
} from "@mui/material";
import {
  Option, 
  Select, 
  ListItemDecorator,
  Avatar
} from "@mui/joy";
import { skillData } from "../data/SkillData";

interface SkillProps {
  getSkill: any;
}
  
const Language: React.FC<SkillProps>= ({getSkill}) => {

  const [skill, setSkill] = useState<string | null>("");

  return (
    <Grid item>
      <FormControl sx={{ width: 200 }}>
        <Select
          onChange={(e, v) => {
              const selectSkill = v as string
              setSkill(selectSkill);
              getSkill(selectSkill);
            }
          }
          sx={{
            '--ListItemDecorator-size': '44px',
            minWidth: 240,
          }}
          placeholder='질문 기술을 선택해주세요'
        >
          {skillData.map((value) => (
            <Option 
            value={value.name}>
              <ListItemDecorator>
                <Avatar size="sm" alt="logo" src={value.logo}/>
              </ListItemDecorator>
              {value.name}
            </Option>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}

export default Language;