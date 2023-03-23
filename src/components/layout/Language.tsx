import React, { useState } from 'react';
import {
    SelectChangeEvent,
    Select,
    Container,
    Grid,
    FormControl,
    MenuItem,
    Chip, 
    Box, 
    Avatar
} from "@mui/material";
import java from "../asset/image/java.png";
import c from "../asset/image/c.png";
import javascript from "../asset/image/javascript.svg";

interface LanguageType {  
    key: number;
    name: string;
    logo?: string;
  }

interface LanguageProps {
  getLanguage: any;
}
  
const Language: React.FC<LanguageProps>= ({getLanguage}) => {

  const languageData = [
      { key: 0, name: 'C', logo: c  },
      { key: 1, name: 'Java', logo: java },
      { key: 2, name: 'JavaScript', logo: javascript },
      { key: 3, name: 'TypeScript' },
      { key: 4, name: 'Flutter' },
      { key: 5, name: 'Python' },
  ]

  const [SelectLang, setSelectLang] = React.useState<string>();

  const onSelectLanguage = (event: SelectChangeEvent) => {
    setSelectLang(event.target.value)
    getLanguage(event.target.value)
  }

  return (
    <Grid item>
      <FormControl sx={{ width: 120 }}>
        <Select
          labelId="chooseLanguage"
          id="choose-Language"
          value={SelectLang || ""} 
          defaultValue={SelectLang}
          onChange={onSelectLanguage}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected}
            </Box>
          )}
          size="small"
        >
          {languageData.map((value) => (
            <MenuItem
              key={value.key}
              value={value.name}
            >
              <Avatar sx={{ width: 25, height: 25 }}
                     alt="icon" src={value.logo}/>
               {value.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
}

export default Language;