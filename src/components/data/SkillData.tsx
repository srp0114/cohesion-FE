import c from "../asset/image/c.png";
import javascript from "../asset/image/javascript.svg";
import java from "../asset/image/java.png";
import react from "../asset/image/react.png";

export interface skillItems {
    name: string,
    logo: string
    type: "language" | "framework";
} 

export const skillData : skillItems[] = [
    {
        name:"C",
        logo: c,
        type: "language"
    }, 
    {
        name:"JavaScript",
        logo: javascript,
        type: "language"
    },
    {
        name:"Java",
        logo: java,
        type: "language"
    },
    {
        name:"React",
        logo: react,
        type: "framework"
    },
    {
        name: "Flutter",
        logo: react,
        type: "language"
    },
    {
        name: "C++",
        logo: c,
        type: "language"
    },
]