import React, {useEffect, useState} from 'react';
import axios from "axios";


const AdminPage = () => {
    const [free, setFree] = useState<Post[]>([]);
    const [qna, setQna] = useState<Post[]>([]);
    const [recruit, setRecruit] = useState<Post[]>([]);
    const [user,setUser] = useState<user[]>([]);

    const [isShowingUser,setIsShowingUser] = useState(false);


    const handleUserButtonClick = () =>{
        setIsShowingUser(true);
    }
    const handleBoardButtonClick = () =>{
        setIsShowingUser(false);
    }
    //유저 테이블
    const renderUserTable = () => {
        return (
            <table>
                <thead>
                <tr>
                    <th>학번</th>
                    <th>닉네임</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {user.map((user) => (
                    <tr key={user.id}>
                        <td>{user.stuId}</td>
                        <td>{user.nickname}</td>
                        <td>
                            <button onClick={() => handleDeleteUser(user.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    interface Post {
        id: number;
        title: string;
        boardType : String;
    }

    interface user {
        id : number;
        stuId: String;
        nickname: string;
    }

   useEffect(()=>{



       axios({
           method : "get",
           url : `/api/admin/check`
       }).then((res)=>{
           if(res.status===200){
                console.log("접속 성공");
           }
       }).catch((err)=>{
           if(err.response && err.response.status===403){
               alert("관리자 계정이 아닙니다!!!");
               window.history.back();
           }
       })


       axios({
           method:"get",
           url:`/api/admin/free`
       }).then((res)=>{
           setFree(res.data)
       }).catch((err)=>{
           console.log(err);
       })

       axios({
           method:"get",
           url:`/api/admin/questions`
       }).then((res)=>{
           setQna(res.data)
       }).catch((err)=>{
           console.log(err);
       })

       axios({
           method:"get",
           url:`/api/admin/recruit`
       }).then((res)=>{
           setRecruit(res.data)
       }).catch((err)=>{
           console.log(err);
       })

       if (isShowingUser) {
        axios({
            method : "get",
            url : `/api/admin/user`
        }).then((res)=>{
            setUser(res.data);
        }).catch((err)=>{
            console.log(err);
        })
       }

   },[isShowingUser]);


    //게시글
    const renderRows = (posts: any[]) => {
        return posts.map((post) => (
            <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>
                    <button onClick={() => handleDeleteBoard(post.id,post.boardType)}>삭제</button>
                </td>
            </tr>
        ));
    };

    //유저 삭제
    const handleDeleteUser = (userId: number) => {
        axios({
            method : "delete",
            url :`/api/admin/user/${userId}`
        }).then((res)=>{
            setUser((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        }).catch((err) => {
                    console.log(err);
        });
    };
    //게시글 삭제
    const handleDeleteBoard = (postId: Number, boardType :String) => {
        axios({
            method : "delete",
            url : `/api/admin/${boardType}/${postId}`
        }).then((res)=>{
            if (boardType === 'FreeBoard') {
                setFree((prevFree) => prevFree.filter((post) => post.id !== postId));
            } else if (boardType === 'QnaBoard') {
                setQna((prevQna) => prevQna.filter((post) => post.id !== postId));
            } else if (boardType === 'RecruitBoard') {
                setRecruit((prevRecruit) => prevRecruit.filter((post) => post.id !== postId));
            }
        }).catch((err)=>{
            console.log(err);
        })
    };

    const postBoard = () =>{
        window.location.replace("/postnotice")
        //TODO : 공지사항 페이지 분리, 작성폼도 관리자인지 check
    }

    return (
        <div>
            <h1>관리자 페이지</h1>
            <div>
                <button onClick={handleBoardButtonClick}>게시판 버튼</button>
                <button onClick={handleUserButtonClick}>유저 버튼</button>
                <button onClick={postBoard}>공지사항 작성</button>
            </div>

            {isShowingUser ? (
                renderUserTable()
            ) : (
                <>
                    <div>
                        <div>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th colSpan={3}>자유</th>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>{renderRows(free)}</tbody>
                        </table>

                        <table>
                            <thead>
                            <tr>
                                <th colSpan={3}>Q&A</th>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>{renderRows(qna)}</tbody>
                        </table>

                        <table>
                            <thead>
                            <tr>
                                <th colSpan={3}>구인</th>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>{renderRows(recruit)}</tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminPage;