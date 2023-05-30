import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { FindIcon } from "../data/IconData";

interface PeopleProps {
  getParty: any;
  getGathered: any;
  partyValue?: number;
  gatheredValue?: number;
  gatheredDisabled?: boolean;
}

const People: React.FC<PeopleProps> = ({ getParty, getGathered, partyValue, gatheredValue, gatheredDisabled }) => {
  const { formState: { errors }, control } = useForm();

  //여기의 party와 gathered가 사용자가 선택한 값
  const [party, setParty] = React.useState<number | null>(partyValue ?? null);
  const [gathered, setGathered] = React.useState<number | null>(gatheredValue ?? null);

  useEffect(() => {
    if (partyValue !== null && !!partyValue) {
      setParty(partyValue);
    }
    if (gatheredValue !== null && !!gatheredValue) {
      setGathered(gatheredValue);
    }
  }, [partyValue, gatheredValue]);

  const [gatheredButtons, setGatheredButtons] = React.useState<Array<{ value: number; disabled: boolean }>>([
    { value: 1, disabled: false },
    { value: 2, disabled: false },
    { value: 3, disabled: false },
    { value: 4, disabled: false },
    { value: 5, disabled: false },
    { value: 6, disabled: false },
    { value: 7, disabled: false },
    { value: 8, disabled: false },
    { value: 9, disabled: false },
  ]);

  useEffect(() => {
    getParty(partyValue);
    getGathered(gatheredValue);
  }, [partyValue, gatheredValue]);

  useEffect(()=>{
    setGathered(1);
  },[party]);

  const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newPartyValue: number | null) => {
    if (newPartyValue !== null) {
      setParty(newPartyValue);
      getParty(newPartyValue);

      const disabledRange = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const isDisabled = (value: number) => value >= newPartyValue;

      const updatedGatheredButtons = disabledRange.map((value) => ({
        value,
        disabled: isDisabled(value),
      }));

      setGatheredButtons(updatedGatheredButtons);
      console.log(`사용자가 선택한 party 값: ${party}`);
    }
  };

  const handleGatheredChange = (event: React.MouseEvent<HTMLElement>, newGatheredValue: number | null) => {
    if (newGatheredValue !== null) {
      setGathered(newGatheredValue);
      getGathered(newGatheredValue);
      console.log(`사용자가 선택한 gathered 값: ${gathered}`);
    }
  };

  return (
    <Grid item container xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
      <Grid item>
        <Controller
          name="party"
          control={control}
          rules={{ required: "총 인원 수를 입력해주세요!" }}
          render={({ field }) => (
            <>
              <FormLabel component="legend" sx={{ marginRight: 1 }} required>총 인원</FormLabel>
              <FormControl fullWidth>
                <ToggleButtonGroup
                  exclusive
                  value={party}
                  onChange={handlePartyChange}
                  sx={{ borderRadius: "20px" }}
                >
                  <ToggleButton value={2}>2</ToggleButton>
                  <ToggleButton value={3}>3</ToggleButton>
                  <ToggleButton value={4}>4</ToggleButton>
                  <ToggleButton value={5}>5</ToggleButton>
                  <ToggleButton value={6}>6</ToggleButton>
                  <ToggleButton value={7}>7</ToggleButton>
                  <ToggleButton value={8}>8</ToggleButton>
                  <ToggleButton value={9}>9</ToggleButton>
                  <ToggleButton value={10}>10</ToggleButton>
                </ToggleButtonGroup>

              </FormControl>
              <FormHelperText error={!!errors.party}>
                {typeof errors.party?.message === "string" && errors.party.message}
              </FormHelperText>
              <Box pl={"0.8rem"} pt={"0.2rem"}>
                {errors.content && <Typography variant="h6" color="error.main">input the value of party</Typography>}
              </Box>
            </>
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="gathered"
          control={control}
          rules={{ required: "모인 인원 수를 입력해주세요!" }}
          render={({ field }) => (
            <>
              <FormLabel component="legend" sx={{ marginRight: 1 }}>모인 인원</FormLabel>
              <FormControl>
                <ToggleButtonGroup
                  exclusive
                  {...field}
                  value={gathered}
                  onChange={handleGatheredChange}
                  sx={{ borderRadius: "20px" }}
                  disabled={gatheredDisabled}
                >
                  {gatheredButtons.map((button) => (
                    <ToggleButton
                      key={button.value}
                      value={button.value}
                      disabled={button.disabled}
                    >
                      {button.value}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <FormHelperText error={!!errors.gathered}>
                  {typeof errors.gathered?.message === "string" && errors.gathered.message}
                </FormHelperText>
                {errors.content && <Typography variant="h6" color="error.main">input the value of gathered</Typography>}
              </FormControl>
            </>
          )}
        />
      </Grid>
      <Grid item sx={{ display: "flex", flexDirection: "row-reverse", textAlign: "center" }}>
        <Stack direction="row">
          <Typography variant="h3">{`${Number(gathered)} / ${Number(party)}`}</Typography> <Typography variant="body1">{`(명)`}</Typography><FindIcon name="recruitPeople" />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default People;