'use client'

import { useAuth } from "@/app/AuthContext"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UpdateRequestDetail(){
    const params = useParams()
    const router = useRouter()

    const { id } = params

    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")
    const [description, setDescription] = useState("")

    const loggedIn = useAuth()

    useEffect(() => {
        console.log(loggedIn);
        if(!loggedIn){
            router.push("/login");
        }else if(localStorage.getItem("username") !== "admin"){
            router.push("/");
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
          const res = await fetch(`http://localhost:3001/update-request/${id}`, {
              method: "get",
              "Content-Type": "application/json",
          })
  
          const fetchData = await res.json();
          setCategory(fetchData.category);
          setContent(fetchData.content);
          setDescription(fetchData.description);
        }
  
        fetchData();
    }, [])

    const handleUpdate = () => {
        if(confirm("수정하시겠습니까?")){
            const fetchData = async () => {
                const patch = await fetch(`http://localhost:3001/quotes/${id}`, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "category": category,
                        "content": content
                    })
                })

                const patchData = await patch.json()
                console.log(patchData);

                const del = await fetch(`http://localhost:3001/update-request/${id}`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const delData = await del.json()
                console.log(delData);

                router.push("/admin");
            }

            fetchData();
        }
    }

    return(
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>분류</th>
                        <td>{category}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{content}</td>
                    </tr>
                    <tr>
                        <th>수정 요청 사유</th>
                        <td>{description}</td>
                    </tr>
                </tbody>
            </table>

            <div>
                <button onClick={handleUpdate}>수정</button>
                <button onClick={() => router.push("/admin")}>목록</button>
            </div>
        </div>
    )
}