'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function QuotesDetail(){
    const params = useParams()
    const router = useRouter()
    const { id } = params
    
    const [data, setData] = useState({})

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3001/quotes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
      
        const fetchData = await res.json();
        console.log(fetchData);

        setData(fetchData);
      }

      fetchData();
    }, [])
    

    const handleList = () => {
        router.push('/')
    }

    return(
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>번호</th>
                        <td>{data.id}</td>
                    </tr>
                    <tr>
                        <th>분류</th>
                        <td>{data.category}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{data.content}</td>
                    </tr>
                </tbody>
            </table>

            <div>
                <button>수정 요청</button>
                <button onClick={handleList}>목록</button>
            </div>
        </div>
    )
}