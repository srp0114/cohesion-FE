import { useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { skillData } from "../data/SkillData";

interface UserSkillProps {
  changeSkills: (skills: string[]) => void;
  skills?: string[];
}

const UserSkill = ({ skills, changeSkills }: UserSkillProps) => {
  const { control } = useForm({ mode: "onChange" });

  const selectedSkills = skillData.filter((skill) => skills?.includes(skill.name));
  const [skill, setSkill] = useState(selectedSkills);

  return (
    <>
      <Controller
        control={control}
        name="skills"
        rules={{
          validate: (data) => {
            if (data && data.length > 5) return false;
          },
        }}
        render={({ field: { ref, onChange, ...field }, fieldState }) => (
          <Autocomplete
            multiple
            value={skill}
            options={skillData}
            getOptionLabel={(option) => option.name}
            onChange={(_, data) => {
              onChange(data);
              setSkill(data);
              changeSkills(data.map((s) => s.name));
            }}
            renderOption={(props, option) => (
              <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                <img src={option.logo} width={20} height={20} />
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                fullWidth
                placeholder="관심기술을 선택해주세요!"
                inputRef={ref}
                variant="outlined"
                error={fieldState.error !== undefined}
                helperText={fieldState.error ? "관심기술은 5개까지 선택할 수 있습니다." : ""}
              />
            )}
          />
        )}
      />
    </>
  );
};

export default UserSkill;
