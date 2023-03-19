import { Board } from "./board";
import { Reply } from "./reply";

export enum Track {
  mobile,
  web,
  bigData,
  digitalContent,
  none
}
export interface User {
  studentId: String;
  password: String;
  name: String;
  nickname: String;
  profileImg: String;
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