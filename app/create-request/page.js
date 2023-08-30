'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthContext"

export default function CreateRequest (){
    const router = useRouter()

    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")

    const { loggedIn } = useAuth()

    useEffect(() => {
      console.log(loggedIn);
      if(!loggedIn){
        router.push("/login");
      }
    }, [])

    const handleList = () => {
        router.push('/')
    }

    const handleCreateRequest = () => {
        fetch("http://localhost:3001/create-request", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                content
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("등록 요청이 정상적으로 처리되었습니다.");
        })
        .catch(err => console.log(err))
    }

    return(
        <div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>분류</th>
                            <td>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    style={{width: 300}}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <input
                                    type="text"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    style={{width: 300}}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <button onClick={handleCreateRequest}>등록 요청</button>
                <button onClick={handleList}>목록</button>
            </div>
        </div>
    )
}