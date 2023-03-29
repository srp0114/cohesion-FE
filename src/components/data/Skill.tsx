import c from "../asset/image/c.png";
import javascript from "../asset/image/javascript.svg";
import java from "../asset/image/java.png";
import react from "../asset/image/react.png";

interface skillItems {
    name: string,
    logo: string
}
//언어 - 이미지 처리 데이터
export const skill : skillItems[] = [
    {
        name:"C",
        logo: c
    }, 
    {
        name:"JavaScript",
        logo: javascript
    },
    {
        name:"Java",
        logo: java
    },
    {
        name:"React",
        logo: react
    },
    {
        name: "Flutter",
        logo: react
    },
    {
        name: "C++",
        logo: c
    },
]