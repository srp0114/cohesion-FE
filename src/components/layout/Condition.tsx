import React, { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface RerquiredProps {
  getRequired: any;
  value?: string;
}
interface OptionalProps {
  getOptional: any;
  value?: string;
}


export const ConditionRequired: React.FC<RerquiredProps> = ({ getRequired, value }) => {
  const { formState: { errors }, control } = useForm();
  const [required, setRequired] = React.useState<string | null>("");

  useEffect(() => {
    if (value) setRequired(value);
  }, [value]);

  return (
    <>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="required"
          rules={{ required: true }}
          render={({ fieldState: { error } }) => (
            <TextField
              label="필수 조건"
              placeholder="필수 조건 예시) 데이터베이스 A분반이셔야합니다."
              value={value}
              onChange={(event) => {
                setRequired(event.target.value);
                getRequired(event.target.value);
              }}
              rows={3}
              multiline

              error={error !== undefined}
              helperText={error ? "필수조건을 입력해주세요!" : ""}
            />
          )}
        />
      </Grid>
    </>
  );
};

export const ConditionOptional: React.FC<OptionalProps> = ({ getOptional, value }) => {
  const [optional, setOptional] = React.useState<string | null>("");

  useEffect(() => {
    if (value) setOptional(value);
  }, [value]);

  return (
    <>
      <Grid item xs={6}>
        <TextField
          label="선택 조건"
          placeholder="선택 조건 예시) 깃허브 사용경험이 있으시면 좋습니다."
          value={value}
          onChange={(event) => {
            setOptional(event.target.value);
            getOptional(event.target.value);
          }}
          rows={3}
          multiline
        />
      </Grid>
    </>
  );
};