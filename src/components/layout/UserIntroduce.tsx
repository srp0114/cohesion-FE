import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface UserIntroduceProps {
  changeIntroduce: (introduce: string) => void;
  introduce?: string;
}

const UserIntroduce = ({ changeIntroduce, introduce }: UserIntroduceProps) => {
    const { control } = useForm({
        mode: "onChange",
        defaultValues: { introduce: introduce },
    });

    return (
        <>
        <Controller
            control={control}
            name="introduce"
            rules={{
            maxLength: 100,
            }}
            defaultValue={introduce || ""}
            render={({ field, fieldState: { error } }) => (
            <TextField
                {...field}
                multiline
                placeholder="자기소개를 해주세요."
                rows={2}
                error={error !== undefined}
                helperText={error ? "글자 수를 초과했습니다." : ""}
                onChange={(e) => {
                field.onChange(e);
                changeIntroduce(e.target.value);
                }}
            />
            )}
        />
        </>
    );
};

export default UserIntroduce;