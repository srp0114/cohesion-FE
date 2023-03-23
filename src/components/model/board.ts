import { Posting } from "./posting";

export enum BoardType {
  free,
  question,
  recruit,
  notice,
  summary //todo(은서): 마이페이지 내 공부요약글 추후 따로 빠질 수 있음
}

export interface Board {
  type: BoardType;
  name: String;
  contents: Array<Posting>;
}