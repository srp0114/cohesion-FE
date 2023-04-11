import { Track } from "../model/user";
import { Reply } from "../model/reply";
import { Board } from "../model/board";
import { MyPageItems } from "../pages/MyPage/MyPage";

export const myPageData_sopho:MyPageItems = {
    studentId: "1901234",
    profileImg: "",
    nickname: "트랙선택한학부생입니다",
    track1: Track.digitalContent,
    track2: Track.web,
    reply: [], //댓글과 관련. 댓글아이디, 그 게시판아이디, 댓글내용, 작성날짜?
    board: [], //각 게시글들과 관련?,여기서 필요한건 게시글 아이디, 게시글 제목, 게시글 타입(어디게시판인지) 정도만 있어도...되지 않나?
    bookmark: [], //게시글 아이디, 게시글 제목,게시글 타입(어디게시판인지) 정도만? 클릭하면 해당 게시글이 있는 곳으로 전환
    point: 410,
    dailySummary: [], //dailySummary interface 따로 만들어야하나 그럼
    skill: "React",
    language: "Python",
    selfIntroduction: `위 경우 Up 값은 0, Down 은 1 이 됩니다. 자동-증가하는 기능은 멤버 값 자체에는 신경 쓰지 않지만, 각 값이 같은 열거형의 다른 값과 구별돼야 하는 경우에 유용합니다.

    열거형을 사용하는 것은 간단합니다: 그냥 열거형 자체에서 프로퍼티로 모든 멤버에 접근하며, 열거형의 이름을 사용해 타입을 선언합니다.
    문자열 열거형은 숫자 열거형처럼 자동-증가하는 기능은 없지만, “직렬화”를 잘한다는 이점이 있습니다. 다시 말해서 만약 당신이 숫자 열거형을 이용해서 디버깅하고 있고 그 값을 읽어야 한다면, 종종 그 값이 불확실한 경우가 있습니다 - 숫자만으로는 이것이 어떤 의미인지 유의미한 정보를 제공해주지 않기 때문입니다. (역 매핑 을 이용하면 도움이 될지라도 말입니다), 반면 문자열 열거형을 이용하면 코드를 실행할 때, 열거형 멤버에 지정된 이름과는 무관하게 유의미하고 읽기 좋은 값을 이용하여 실행할 수 있습니다.

이종 열거형 (Heterogeneous enums)
기술적으로 열거형은 숫자와 문자를 섞어서 사용할 수 있지만 굳이 그렇게 할 이유는 없습니다.`
}

  export const myPageData_fresh:MyPageItems = {
    studentId: "2312345",
    profileImg: "",
    nickname: "새내깁니다",
    track1: Track.none,
    track2: Track.none,
    reply: [],
    board: [],
    bookmark: [],
    point: 50,
    dailySummary: [],
    language: "C",
    selfIntroduction: "올해 입학한 새내기입니다. C언어 배우고 있습니다."
  };