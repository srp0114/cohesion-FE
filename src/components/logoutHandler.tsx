import axios from "axios";


export async function logoutHandler() {
    axios({
        method : "get",
        url : "http://localhost:8081/logout",
        withCredentials : true
    }).then((res)=>{
        sessionStorage.clear();
        window.location.href="/";
    }).catch((err)=>{
        console.log(err);
    })
}