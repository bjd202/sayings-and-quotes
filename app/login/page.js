'use client'

import { useState } from "react"
import { useAuth } from "../AuthContext"
import { useRouter } from "next/navigation"
import bcrypt from 'bcryptjs'

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
                return d.username === username && bcrypt.compareSync(password, d.password)
            })
            console.log(loggedInData);

            if(loggedInData.length > 0){
                login();
                localStorage.setItem("username", loggedInData[0].username);
                router.push("/");
            }else{
                alert("로그인 실패");
            }
        }
        
        fetchData();
    }

    const handleCreateUser = () => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:3001/users", {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const fetchData = await res.json();
            const existUser = fetchData.filter(d => {
                return d.username === username
            })

            if (existUser.length > 0) {
                alert("이미 존재하는 아이디입니다.");
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                fetch("http://localhost:3001/users", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        "password": hash,
                    })
                })
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
                <button onClick={handleCreateUser}>계정 생성</button>
            </div>
        </div>
    )
}