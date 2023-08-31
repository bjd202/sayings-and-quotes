'use client'

import { useAuth } from "@/app/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function QuotesDetail(){
    const params = useParams()
    const router = useRouter()
    const { id } = params
    
    const [data, setData] = useState({})

    const [isUpdateRequest, setIsUpdateRequest] = useState(false)

    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")
    const [description, setDescription] = useState("")

    const { loggedIn } = useAuth()

    useEffect(() => {
      console.log(loggedIn);
      if(!loggedIn){
        router.push("/login");
      }
    }, [])

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

        setCategory(fetchData.category);
        setContent(fetchData.content);
      }

      fetchData();
    }, [])
    

    const handleList = () => {
        router.push('/')
    }

    const handleUpdateRequest = () => {
      fetch("http://localhost:3001/update-request", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "quotes-id": data.id,
          "category": category,
          "content": content,
          "description": description,
          "username": localStorage.getItem("username")
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        alert("수정 요청이 정상적으로 처리되었습니다.");
      })
      .catch(err => console.log(err))
    }

    return(
        <div>
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
            </div>

            <div>
                <button onClick={() => setIsUpdateRequest(!isUpdateRequest)}>수정 요청</button>
                <button onClick={handleList}>목록</button>
            </div>

            {
              isUpdateRequest ? (
                <div>
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <th>번호</th>
                            <td>{data.id}</td>
                          </tr>
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
                          <tr>
                            <th>수정 요청 사유</th>
                            <td>
                              <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)}
                                style={{width: 300, height: 100}}
                              />
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <button onClick={handleUpdateRequest}>수정 요청</button>
                  </div>

                </div>
              ) : null
            }

            
        </div>
    )
}