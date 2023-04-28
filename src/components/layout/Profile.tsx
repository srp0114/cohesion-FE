import React, { useState, useEffect } from "react" 
import Avatar from "boring-avatars";

const Profile = () => { 
    const [name, setName] = useState<string>("");

     useEffect(() => {
        setName(`User ${Math.floor(Math.random() * 1000)}`); // User 0~999 랜덤으로 이름값 지정
    }, [])

    console.log(name);

    return (
        <Avatar
            name={name}
            size={50}
            variant="beam"
            colors={["#58B76B", "#FFE045", "#B5CC6C", "#AED62E", "#87D241"]}
        />
    )
}

export default Profile