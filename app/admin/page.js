'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthContext"

export default function Admin(){
    const router = useRouter()

    const [createRequestData, setCreateRequestData] = useState([])
    const [updateRequestData, setUpdateRequestData] = useState([])

    const { loggedIn } = useAuth()

    useEffect(() => {
      console.log(loggedIn);
      if(!loggedIn){
        router.push("/login");
      }else if(localStorage.getItem("username") !== "admin"){
        router.push("/");
      }
    }, [])

    useEffect(() => {
      const createRequestData = async () => {
        const res = await fetch("http://localhost:3001/create-request", {
            method: "get",
            "Content-Type": "application/json",
        })

        const fetchData = await res.json();
        setCreateRequestData(fetchData);
      }

      const updateRequestData = async () => {
        const res = await fetch("http://localhost:3001/update-request", {
            method: "get",
            "Content-Type": "application/json",
        })

        const fetchData = await res.json();
        setUpdateRequestData(fetchData);
      }

      createRequestData();
      updateRequestData();
    }, [])
    
    const handleCreate = (e, createData) => {
        e.stopPropagation();
        console.log(createData);
        if(confirm("등록하시겠습니까?")){
            const fetchData = async () => {
                const post = await fetch(`http://localhost:3001/quotes`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "category": createData.category,
                        "content": createData.content
                    })
                })

                const postData = await post.json()
                console.log(postData);

                const del = await fetch(`http://localhost:3001/create-request/${createData.id}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const delData = await del.json()
                console.log(delData);

                setCreateRequestData(
                    createRequestData.filter(d => {
                        return d.id !== createData.id
                    })
                )
            }

            fetchData();
        }
    }

    const handleUpdate = (e, updateData) => {
        e.stopPropagation();
        console.log(updateData);
        if(confirm("수정하시겠습니까?")){
            const fetchData = async () => {
                const patch = await fetch(`http://localhost:3001/quotes/${updateData["quotes-id"]}`, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "category": updateData.category,
                        "content": updateData.content
                    })
                })

                const patchData = await patch.json()
                console.log(patchData);

                const del = await fetch(`http://localhost:3001/update-request/${updateData.id}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const delData = await del.json()
                console.log(delData);

                setUpdateRequestData(
                    updateRequestData.filter(d => {
                        return d.id !== updateData.id
                    })
                )
            }

            fetchData();
        }
    }

    const handleCreateRequestDelete = (e, id) => {
        e.stopPropagation();
        if(confirm("삭제하시겠습니까?")){
            const fetchData = async () => {
                const del = await fetch(`http://localhost:3001/create-request/${id}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                const delData = await del.json()
                console.log(delData);
    
                setCreateRequestData(
                    createRequestData.filter(d => {
                        return d.id !== id
                    })
                )
            }

            fetchData();
        }
    }

    const handleUpdateRequestDelete = (e, id) => {
        e.stopPropagation();
        if(confirm("삭제하시겠습니까?")){
            const fetchData = async () => {
                const del = await fetch(`http://localhost:3001/update-request/${id}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                const delData = await del.json()
                console.log(delData);
    
                setUpdateRequestData(
                    updateRequestData.filter(d => {
                        return d.id !== id
                    })
                )
            }

            fetchData();
        }
    }

    const handleCreateRequestDetail = (id) => {
        router.push(`/admin/create-request/${id}`);
    }

    const handleUpdateRequestDetail = (id) => {
        router.push(`/admin/update-request/${id}`);
    }

    return(
        <div>
            <h2>관리자 페이지</h2>
            
            <div>
                <button onClick={() => router.push("/")}>유저 페이지</button>
            </div>

            <div style={{display: "flex"}}>
                <div>
                    <table>
                        <caption>등록 요청</caption>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>내용</th>
                                <th>작성자</th>
                                <th>-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                createRequestData.length > 0 ?
                                createRequestData.map((d) => {
                                    return(
                                        <tr key={d.id} onClick={() => handleCreateRequestDetail(d.id)} style={{cursor: "pointer"}}>
                                            <td>{d.id}</td>
                                            <td>{d.category}</td>
                                            <td>{d.content}</td>
                                            <td>{d.username}</td>
                                            <td>
                                                <button onClick={(e) => handleCreate(e, d)}>등록</button>
                                                <button onClick={(e) => handleCreateRequestDelete(e, d.id)}>삭제</button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan={5}>데이터가 없습니다.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <caption>수정 요청</caption>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>내용</th>
                                <th>작성자</th>
                                <th>-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                updateRequestData.length > 0 ?
                                updateRequestData.map((d) => {
                                    return(
                                        <tr key={d.id} onClick={() => handleUpdateRequestDetail(d.id)} style={{cursor: "pointer"}}>
                                            <td>{d.id}</td>
                                            <td>{d.category}</td>
                                            <td>{d.content}</td>
                                            <td>{d.username}</td>
                                            <td>
                                                <button onClick={(e) => handleUpdate(e, d)}>수정</button>
                                                <button onClick={(e) => handleUpdateRequestDelete(e, d.id)}>삭제</button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan={5}>데이터가 없습니다.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}