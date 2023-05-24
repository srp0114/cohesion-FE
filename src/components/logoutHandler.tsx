import axios from "axios";


export async function logoutHandler() {
    const asUrl = process.env.REACT_APP_AUTHORIZATION_SERVER_URL;

    axios({
        method : "get",
        url : `${asUrl}/logout`,
        withCredentials : true
    }).then((res)=>{
        sessionStorage.clear();
        window.location.href="/";
    }).catch((err)=>{
        console.log(err);
    })
}