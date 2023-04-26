import Avatar from "boring-avatars";

const Profile = () => { 
    const name = Math.floor(Math.random() * 1000).toString(); // 0~999까지의 랜덤한 숫자로 이름 생성
    console.log(name)
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
