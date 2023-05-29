import React, { useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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

  const [partyAlignment, setPartyAlignment] = React.useState<number>(0);
  const [gatheredAlignment, setGatheredAlignment] = React.useState<number>(0);

  useEffect(() => {
    getParty(partyValue);
    getGathered(gatheredValue);
  }, [partyValue, gatheredValue]);

  const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newAlignment: number) => {
    setPartyAlignment(newAlignment);
    getParty(partyAlignment);
  };

  const handleGatheredChange = (event: React.MouseEvent<HTMLElement>, newAlignment: number) => {
    setGatheredAlignment(newAlignment);
    getGathered(gatheredAlignment);
  };

  return (
    <Grid item xs={12}>
      <Stack direction="row" sx={{display:"flex", justifyContent:"space-between"}}>
        <Controller
          name="party"
          control={control}
          defaultValue={2}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth>
              <ToggleButtonGroup
                exclusive
                {...field}
                value={partyValue}
                onChange={handlePartyChange}
                >
                <ToggleButton size="large" value={2}>2</ToggleButton>
                <ToggleButton size="large" value={3}>3</ToggleButton>
                <ToggleButton size="large" value={4}>4</ToggleButton>
                <ToggleButton size="large" value={5}>5</ToggleButton>
                <ToggleButton size="large" value={6}>6</ToggleButton>
                <ToggleButton size="large" value={7}>7</ToggleButton>
                <ToggleButton size="large" value={8}>8</ToggleButton>
                <ToggleButton size="large" value={9}>9</ToggleButton>
                <ToggleButton size="large" value={10}>10</ToggleButton>
              </ToggleButtonGroup>

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
              <ToggleButtonGroup
                {...field}
                value={gatheredValue}
                onChange={handleGatheredChange}
                /* partyValue에 따라 disabled true false */
                
              >
                <ToggleButton size="large" value={1}>1</ToggleButton>
                <ToggleButton size="large" value={2}>2</ToggleButton>
                <ToggleButton size="large" value={3}>3</ToggleButton>
                <ToggleButton size="large" value={4}>4</ToggleButton>
                <ToggleButton size="large" value={5}>5</ToggleButton>
                <ToggleButton size="large" value={6}>6</ToggleButton>
                <ToggleButton size="large" value={7}>7</ToggleButton>
                <ToggleButton size="large" value={8}>8</ToggleButton>
                <ToggleButton size="large" value={9}>9</ToggleButton>
              </ToggleButtonGroup>
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