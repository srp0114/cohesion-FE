import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";

// 로그인 여부 판단 함수

export async function checkLogin() {
    const verifier = new IdTokenVerifier({
        issuer: "http://localhost:8081", // issuer 가 같은지
        audience: "client", // audience 가 같은지
        jwksURI: "http://localhost:8081/oauth2/jwks", // get public key
    });

    const id_token = sessionStorage.getItem("id_token");

    if (id_token) { // 토큰이 있는 경우
        try {
            await new Promise<void>((resolve, reject) => {
                verifier.verify(id_token, (error, payload) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
            // 검증에 성공한 경우 로그인 여부 판단
            const response = await axios.get("/api/check");
            const check = response.data;
            if (check === true) { // 로그인 된 상태
                return true;
            } else { // 부가정보를 입력하지 않은 유저
                window.location.replace("/welcome");
            }
        } catch (error) { // 토큰은 있으나 검증에 실패한 경우
            // TODO 특정 작업 수행
            console.log("ID Token 검증 실패");
        }
    } else { // ID Token이 없는 경우
        console.log("ID Token 없음");
    }
}