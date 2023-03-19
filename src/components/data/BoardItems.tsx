import c from "../data/c_logo.png";
import js from "../data/js_logo.svg";
import java from "../data/java_logo.png";
import react from "../data/react_logo.png";
export const boardItems = [
    {
        nickname: 'dnridk (22)',
        time: '1초 전',
        title: '웹 개발 중 카카오 주소 api 사용 중 궁금한 게 있습니다',
        content: `주소 api에서 검색 결과를 클릭하면 열리는 팝업 창으로 검색 결과 값을 넘기는 방법이 궁금합니다.
        회원 가입 페이지에 만들어 둔 인풋 박스에 값 넘기는 건 예제도 있어서 문제가 없는데, 
        팝업창을 사용하는 경우는 다른 jsp 파일로 값을 넘겨야 해서 어떻게 해야 할지 도무지 감이 안 오네요ㅠㅠ`,
        language: null,
        bookmark: 1,
        comment: 5,
    },
    {
        nickname: '가나다라 (23)',
        time: '3초 전',
        title: 'c언어 배열 어떻게 해야하나요?',
        content: `제가 이해가 되지 않는 부분은  for (s = 0; s < grade[i]; s++)  입니다.
        1. grade[i] 들어가야 원소 수만큼 *를 출력하는 원리가 무엇인지 궁금합니다.
        2. grade[s] 를 넣어준다면 전부 5개의 *만 출력되는 이유가 무엇인지도 궁금합니다.`,
        language: c,
        bookmark: 0,
        comment: 2,
    },
    {
        nickname: 'dqpqp (21)',
        time: '1분 전',
        title: 'c 반복문 질문있습니다',
        content: `문제가 3명의 학생정보를 반복문으로 돌려서 이름, 학과, 주민등록번호를 입력받아서 이름, 생년월일, 윤년 여부, 출생지역(대한민국, 외국), 성별(남자, 여자), 학과 이름을 출력하는건데요.
        우선 반복문을 사용해서, 출력하는건 다 해봤습니다. `,
        language: c,
        bookmark: 1,
        comment: 3,
    },
    {
        nickname: '12abc34 (20)',
        time: '2분 전',
        title: '자바스크립트 질문있습니다',
        content: `focusout 과 blur 의 차이를 알고 싶습니다.
        focusout 또는 blur 를 사용중에 아래와 같은 에러가 발생했는데요.
        "Uncaught DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"`,
        language: js,
        bookmark: 0,
        comment: 0,
    },
    {
        nickname: '12abc34 (20)',
        time: '2분 전',
        title: '리액트 에러가 발생했는데 어떻게 해결해야하나요',
        content: `focusout 사용중에 아래와 같은 에러가 발생했는데요.
        "Uncaught DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"`,
        language: react,
        bookmark: 0,
        comment: 0,
    },
    {
        nickname: '12abc34 (20)',
        time: '2분 전',
        title: '자바스크립트 질문있습니다',
        content: `focusout 과 blur 의 차이를 알고 싶습니다.
        focusout 또는 blur 를 사용중에 아래와 같은 에러가 발생했는데요.
        "Uncaught DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"`,
        language: js,
        bookmark: 0,
        comment: 0,
    },
    {
        nickname: '12abc34 (20)',
        time: '2분 전',
        title: '자바스크립트 질문있습니다',
        content: `focusout 과 blur 의 차이를 알고 싶습니다.
        focusout 또는 blur 를 사용중에 아래와 같은 에러가 발생했는데요.
        "Uncaught DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"`,
        language: js,
        bookmark: 0,
        comment: 0,
    },
    {
        nickname: '12abc34 (20)',
        time: '2분 전',
        title: '자바스크립트 질문있습니다',
        content: `focusout 과 blur 의 차이를 알고 싶습니다.
        focusout 또는 blur 를 사용중에 아래와 같은 에러가 발생했는데요.
        "Uncaught DOMException: Failed to execute 'remove' on 'Element': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"`,
        language: js,
        bookmark: 0,
        comment: 0,
    }
];

export const mostViewedItems = [
    {
        nickname: '가나다라 (23)',
        title: 'c언어 배열 어떻게 해야하나요?',
        language: c,
    },
    {
        nickname: 'dnridk (22)',
        title: '자바 질문해요!!',
        language: java,
    },
    {
        nickname: '12abc34 (20)',
        title: '컴포넌트 사용 도와주세요',
        language: js,
    },
    {
        nickname: 'dqpqp (21)',
        title: '리액트 오류 해결 어떻게 해야하죠??',
        language: c,
    }
];
