import react, { useState } from "react";
import Avatar from "boring-avatars";

interface ProfileProps {
    nickname: string;
    size: number;
}

const Profile = ({nickname, size} : ProfileProps) => {
    return (
        <Avatar
            name={nickname}
            size={size}
            variant="beam"
            colors={["#58B76B", "#FFE045", "#B5CC6C", "#AED62E", "#87D241"]}
        />
    )
}

export default Profile;