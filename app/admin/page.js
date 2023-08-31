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
                                createRequestData.map((d) => {
                                    return(
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td>{d.category}</td>
                                            <td>{d.content}</td>
                                            <td>{d.username}</td>
                                            <td></td>
                                        </tr>
                                    )
                                })
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
                                updateRequestData.map((d) => {
                                    return(
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td>{d.category}</td>
                                            <td>{d.content}</td>
                                            <td>{d.username}</td>
                                            <td></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}