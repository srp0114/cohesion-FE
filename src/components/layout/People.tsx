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

const People: React.FC<PeopleProps> = ({ getParty, getGathered, partyValue, gatheredValue, }) => {
  const { formState: { errors }, control } = useForm();

  //여기의 party와 gathered가 사용자가 선택한 값
  const [party, setParty] = React.useState<number | null>(0);
  const [gathered, setGathered] = React.useState<number | null>(0);

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

  const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newPartyValue: number | null) => {
    if (newPartyValue !== null) {
      setParty(newPartyValue);
      getParty(newPartyValue);

      const disabledRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((value) => value < newPartyValue);
      const isDisabled = (value: number) => !disabledRange.includes(value);

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
    <Grid item container xs={12}>
      <Grid item xs={12} md={6}>
        <Controller
          name="party"
          control={control}
          rules={{ required: "총 인원 수를 입력해주세요!" }}
          render={({ field }) => (
            <FormControl fullWidth>
              <ToggleButtonGroup
                exclusive
                value={party}
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

              <FormHelperText error={!!errors.party}>
                {typeof errors.party?.message === "string" && errors.party.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="gathered"
          control={control}
          rules={{ required: "모인 인원 수를 입력해주세요!" }}
          render={({ field }) => (
            <FormControl>
              <ToggleButtonGroup
                exclusive
                {...field}
                value={gathered}
                onChange={handleGatheredChange}
              >
                {gatheredButtons.map((button) => (
                  <ToggleButton
                    key={button.value}
                    size="large"
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
            </FormControl>
          )}
        /></Grid>

    </Grid>
  );
};

export default People;