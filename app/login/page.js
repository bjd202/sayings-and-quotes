'use client'

import { useState } from "react"
import { useAuth } from "../AuthContext"
import { useRouter } from "next/navigation"

export default function Login(){

    const router = useRouter()
    const { login } = useAuth()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:3001/users`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const fetchData = await res.json();
            const loggedInData = fetchData.filter(d => {
                return d.username === username && d.password === password
            })
            console.log(loggedInData);

            if(loggedInData.length > 0){
                login();
                router.push("/");
            }else{
                alert("로그인 실패");
            }
        }
        
        fetchData();
    }

    return(
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>아이디</th>
                        <td>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div>
                <button onClick={handleLogin}>로그인</button>
            </div>
        </div>
    )
}