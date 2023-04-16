import React from "react";
import { Grid, Stack, TextField } from "@mui/material";

interface PeopleProps {
    getParty : any;
    getGathered : any;
}

const People : React.FC<PeopleProps> = ({getParty, getGathered}) => (
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
        onChange={(event) => getParty(parseInt(event.target.value))}
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
        onChange={(event) => getGathered(parseInt(event.target.value))}
      />
    </Stack>
  </Grid>
);

export default People;
