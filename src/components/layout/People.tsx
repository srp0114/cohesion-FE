import React, { useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
  Stack,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface PeopleProps {
  getParty: any;
  getGathered: any;
  partyValue?: number;
  gatheredValue?: number;
}

interface PeopleInputs {
  party: number;
  gathered: number;
}

const People: React.FC<PeopleProps> = ({
  getParty,
  getGathered,
  partyValue,
  gatheredValue,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PeopleInputs>();

  useEffect(() => {
    getParty(partyValue);
    getGathered(gatheredValue);
  }, [partyValue, gatheredValue]);

  const handlePartyChange = (event: SelectChangeEvent<number>) => {
    getParty(event.target.value);
  };

  const handleGatheredChange = (event: SelectChangeEvent<number>) => {
    getGathered(event.target.value);
  };

  return (
    <Grid item>
      <Stack direction="row">
        <Controller
          name="party"
          control={control}
          defaultValue={2}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>총 인원</InputLabel>
              <Select
                {...field}
                value={partyValue}
                onChange={handlePartyChange}
                error={!!errors.party}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
              <FormHelperText>
                `{`예) 캡스톤 디자인은 4명팀이므로, 총 인원은 4명`}`
              </FormHelperText>
              {errors.party && (
                <FormHelperText>총 인원 수는 필수로 선택되어야 합니다.</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="gathered"
          control={control}
          rules={{
            required: true,
            min: 0,
            max: partyValue ? partyValue - 1 : undefined,
          }}
          render={({ field }) => (
            <FormControl>
              <InputLabel>현재까지 모인 인원</InputLabel>
              <Select
                {...field}
                value={gatheredValue}
                onChange={handleGatheredChange}
                /* partyValue에 따라 disabled true false */
                error={!!errors.gathered}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
              </Select>
              <FormHelperText>
                `{`예) 4명팀에서 작성자 본인만 있다면, 현재까지 1명이 모임.`}`
              </FormHelperText>
              {errors.gathered && (
                <FormHelperText>
                  {errors.gathered?.type === "min"
                    ? "현재까지 모인 인원은 0명 이상이어야 합니다."
                    : errors.gathered?.type === "max"
                      ? "현재까지 모인 인원은 총 인원 수 - 1 이하여야 합니다."
                      : "현재까지 모인 인원은 필수로 선택되어야 합니다."}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Stack>
    </Grid>
  );
};

export default People;