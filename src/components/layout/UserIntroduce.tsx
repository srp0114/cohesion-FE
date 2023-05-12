import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface UserIntroduceProps {
    setIntroduce: (selfIntroduction: string) => void;
    introduce?: string;
}

const UserIntroduce = ({ setIntroduce, introduce }: UserIntroduceProps) => {
    const { formState: { errors }, control } = useForm({ mode: "onChange" });

    return (
        <>
            <Controller
                control={control}
                name="introduce"
                rules={{
                    maxLength: 100,
                }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        defaultValue={introduce}
                        multiline
                        fullWidth
                        variant="outlined"
                        label="자기소개"
                        placeholder="자기소개를 해주세요."
                        {...field}
                        rows={2}
                        error={error !== undefined}
                        helperText={error ? "글자 수를 초과했습니다." : ""}
                        onChange={(e) => setIntroduce(e.target.value)}
                    />
                )}
            />
        </>
    )
}

export default UserIntroduce;
