import { Board } from "./board";
import { Reply } from "./reply";

export enum Track {
  mobile = "모바일소프트웨어",
  web = "웹공학",
  bigData = "빅데이터",
  digitalContent = "디지털콘텐츠 · 가상현실",
  none = "미정"
}
export interface User {
  studentId: String;
  password: String;
  name: String;
  nickname: String;
  profileImg: String | null;
  point: number;
  track1: Track;
  track2: Track;
  showOff?: Array<String>;

  reply: Array<Reply>;
  board: Array<Board>;
  bookmark: Array<Board>;

  dailySummary: Array<Board>;
  selfIntroduction: String;
}