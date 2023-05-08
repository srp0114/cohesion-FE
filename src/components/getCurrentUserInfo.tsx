import axios, {AxiosResponse} from "axios";

interface SimpleUserInfo {
  id: number;
  studentId: number;
  name: string;
  profileImg: string | null;
  point: number;
  nickname: string;
  career: string;
  introduce: string;
  track1: string;
  track2: string;
}

/**
 * 접속한 유저의 정보를 반환하는 함수
 * 반환 값의 타입은 상단에 정의된 SimpleUserInfo
 */
export function getCurrentUserInfo(): Promise<SimpleUserInfo> {
  return axios({
    method: "get",
    url: "/api/user-info/simple"
  })
    .then((res: AxiosResponse<SimpleUserInfo>) => {
      return res.data
    })
    .catch((err) => {
      console.log(err);
      throw err;
    })
}