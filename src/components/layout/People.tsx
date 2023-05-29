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

  //여기의 party와 gathered가 사용자가 선택한 값
  const [party, setParty] = React.useState<number | null>(4);
  const [gathered, setGathered] = React.useState<number | null>(1);

  const [gatheredButtons, setGatheredButtons] = React.useState<Array<{ value: number; disabled: boolean }>>([
    { value: 1, disabled: false },
    { value: 2, disabled: false },
    { value: 3, disabled: false },
  ]);

  useEffect(() => {
    getParty(partyValue);
    getGathered(gatheredValue);
  }, [partyValue, gatheredValue]);

  const handlePartyChange = (event: React.MouseEvent<HTMLElement>, newPartyValue: number | null) => {
    if (newPartyValue !== null) {
      setParty(newPartyValue);

      const disabledRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((value) => value < newPartyValue);
      const isDisabled = (value: number) => !disabledRange.includes(value);

      const updatedGatheredButtons = disabledRange.map((value) => ({
        value,
        disabled: isDisabled(value),
      }));

      setGatheredButtons(updatedGatheredButtons);
      console.log(`사용자가 선택한 party 값: ${party}`);
      //getParty();
    }
  };

  const handleGatheredChange = (event: React.MouseEvent<HTMLElement>, newGatheredValue: number | null) => {
    if (newGatheredValue !== null) {
      setGathered(newGatheredValue);
      console.log(`사용자가 선택한 gathered 값: ${gathered}`);
      //getGathered();
    }
  };

  return (
    <Grid item container xs={12}>
      <Grid item xs={12} md={6}>
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

              <FormHelperText>
                `{`예) 캡스톤 디자인은 4명팀이므로, 총 인원은 4명`}`
              </FormHelperText>
              {errors.party && (
                <FormHelperText>총 인원 수는 필수로 선택되어야 합니다.</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="gathered"
          control={control}
          rules={{ required: true }}
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
        /></Grid>

    </Grid>
  );
};

export default People;