//댓글
import { Posting } from "./posting";
import { User } from "./user";

export interface Reply {
  id: number;
  writer: string; //댓글 작성자 닉네임
	postingID: number//어느 게시글에 달았는지 구분하기 위함 Posting.id
  content: string;
  createdDate: string;
  modifiedDate?: string;
  reports: number;
  isChosen?: boolean; //Q&A
	parentID? : number; //

//todo(은서):
}