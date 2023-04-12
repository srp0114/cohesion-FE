import React, { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { FormControlProps } from "react-bootstrap";

interface RerquiredProps {
  getRequired: any;
}
interface OptionalProps {
  getOptional: any;
}

export const ConditionRequired : React.FC<RerquiredProps>= ({getRequired}) => {
  const [required, setRequired] = React.useState<string | null>("");

  return (
    <>
      <Grid item>
        <TextField
          required
          label="필수 조건"
          placeholder="필수 조건 예시) 데이터베이스 A분반이셔야합니다."
          onChange={(event) => {
            setRequired(event.target.value);
            getRequired(event.target.value);
          }}
        >
            
        </TextField>
      </Grid>
    </>
  );
};

export const ConditionOptional : React.FC<OptionalProps>= ({getOptional}) => {
  const [optional, setOptional] = React.useState<string | null>("");
  return (
    <>
      <Grid item>
        <TextField
          label="선택 조건"
          placeholder="선택 조건 예시) 깃허브 사용경험이 있으시면 좋습니다."
          onChange={(event) => {
            setOptional(event.target.value);
            getOptional(event.target.value);
          }}
        ></TextField>
      </Grid>
    </>
  );
};
