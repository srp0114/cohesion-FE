import React from "react";
import { Grid, Stack, TextField } from "@mui/material";

interface PeopleProps {
    getPeople : any;
  }

const People = () => (
  <Grid item>
    <Stack direction="row">
      <TextField
        required
        label="총 인원"
        placeholder="예) 조별 인원: 4"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      />

      <TextField
        required
        label="현재 모인 인원"
        placeholder="예) 글쓴이 포함 모인 인원: 1"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      />
    </Stack>
  </Grid>
);

export default People;
