import BoringAvatar from "boring-avatars";
import { Avatar } from "@mui/material";

interface ProfileProps {
    nickname: string;
    imgUrl: string | undefined;
    size: number;
}

const Profile = ({nickname, imgUrl, size} : ProfileProps) => {
    return (
        imgUrl === undefined ? 
        <BoringAvatar
            name={nickname}
            size={size}
            variant="beam"
            colors={["#58B76B", "#FFE045", "#B5CC6C", "#AED62E", "#87D241"]}
        /> :  <Avatar srcSet={imgUrl} sx={{ width: "2rem", height: "2rem"}} />

    )
}

export default Profile;