import c from "../asset/image/c.png";
import javascript from "../asset/image/javascript.svg";
import java from "../asset/image/java.png";
import react from "../asset/image/react.png";
import python from "../asset/image/python.png";
import spring from "../asset/image/spring.png";
import typescript from "../asset/image/typescript.svg";
import nodejs from "../asset/image/nodejs.svg";
import kotlin from "../asset/image/kotlin.svg";
import swift from "../asset/image/swift.png";
import flutter from "../asset/image/flutter.svg";
import mysql from "../asset/image/mysql.png";
import dart from "../asset/image/dart.svg";
import oracle from "../asset/image/oracle.png";
import r from "../asset/image/r.svg";
import unity from "../asset/image/unity.png";
import cpp from "../asset/image/cpp.svg";
import csharp from "../asset/image/csharp.svg"

export interface skillItems {
    name: string,
    logo: string
    type: "language" | "stack";
} 

export const skillData : skillItems[] = [
    {
        name: "Python",
        logo: python,
        type: "language"
    },
    {
        name:"C",
        logo: c,
        type: "language"
    }, 
    {
        name:"Java",
        logo: java,
        type: "language"
    },
    {
        name:"Spring",
        logo: spring,
        type: "stack"
    },
    {
        name:"JavaScript",
        logo: javascript,
        type: "language"
    },
    {
        name:"TypeScript",
        logo: typescript,
        type: "language"
    },
    {
        name:"React",
        logo: react,
        type: "stack"
    },
        {
        name:"Node.js",
        logo: nodejs,
        type: "stack"
    },
    {
        name: "Kotlin",
        logo: kotlin,
        type: "language"
    },
    {
        name: "Swift",
        logo: swift,
        type: "language"
    },
    {
        name: "Flutter",
        logo: flutter,
        type: "stack"
    },
    {
        name: "Dart",
        logo: dart,
        type: "language"
    },
    {
        name: "MySQL",
        logo: mysql,
        type: "stack"
    },
    {
        name: "Oracle",
        logo: oracle,
        type: "stack"
    },
    {
        name: "C++",
        logo: cpp,
        type: "language"
    },
    {
        name: "C#",
        logo: csharp,
        type: "language"
    },
    {
        name: "R",
        logo: r,
        type: "language"
    },
    {
        name: "Unity",
        logo: unity,
        type: "stack"
    },
    
]
