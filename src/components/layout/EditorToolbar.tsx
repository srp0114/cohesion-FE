import { useRef, useState, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-dark.css'
import axios from 'axios';

type Props = {
    getContent: any;
}

// Undo and redo functions for Custom Toolbar
function undoChange() {

}
function redoChange() {

}

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

hljs.configure({
    languages: ['javascript', 'ruby', 'python', 'rust'],
})

const EditorToolbar: React.FC<Props> = ({getContent}) => {
    const QuillRef = useRef<ReactQuill>();
    const [content, setContent] = useState("");

    // 이미지를 업로드 하기 위한 함수
    const imageHandler = () => {

        const input = document.createElement("input");
        input.setAttribute('type','file');
        input.setAttribute('multiple','multiple');
        const formData = new FormData();
        const fileList : File[] = [];

        input.setAttribute('accept','image/*');
        input.click();

        input.onchange = async () => {
            const files: FileList | null = input.files;
            const fileArray = Array.prototype.slice.call(files);

            fileArray.forEach((file) => {
                fileList.push(file);
            })
            fileList.forEach((file) => {
                formData.append('multipartFiles', file);
            })
            try {
                let response = await axios({
                    method: "post",
                    url: "/api/return/imageUrl",
                    headers: {"Content-Type": "multipart/form-data"},
                    data: formData,
                });
                console.log("###", response);
                const url = "http://localhost:8080"+response.data;
                const range = QuillRef.current?.getEditor().getSelection()?.index;
                if (range !== null && range !== undefined) {
                    let quill = QuillRef.current?.getEditor();
                    quill?.setSelection(range, 1);
                    quill?.clipboard.dangerouslyPasteHTML(
                        range,
                        `<img src=${url} alt="이미지 태그 삽입" />`
                    );
                }


            } catch (err) {
                console.log("이미지 핸들러 선택 에러");
            }
        }
    }

    const modules = useMemo(() => ({
            syntax: {
                highlight: (text: string) => hljs.highlightAuto(text).value,
            },
            toolbar: {
                container: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ],
                    ["image", "video"],
                ],
                handlers: {
                    undo: undoChange,
                    redo: redoChange,
                    image: imageHandler,
                },
            },
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true
            }
        }),
        []
    );

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "align",
        "strike",
        "script",
        "blockquote",
        "background",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "code-block"
    ];


    return (
        <>

            <ReactQuill
                ref={(element) => {
                    if (element !== null) {
                        QuillRef.current = element;
                    }
                }}
                value={content}
                onChange={(content) => {
                    setContent(content);
                    getContent(content);
                }}
                formats={formats}
                modules={modules}
                theme="snow"
                placeholder="내용을 입력해주세요."
            />
        </>
    )
}

export default EditorToolbar;