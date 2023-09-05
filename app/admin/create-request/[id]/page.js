'use client'

import { useAuth } from "@/app/AuthContext"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row, Table } from "react-bootstrap"

export default function CreateRequestDetail(){
    const params = useParams()
    const router = useRouter()

    const { id } = params

    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")

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
        const res = await fetch(`http://localhost:3001/create-request/${id}`, {
            method: "get",
            "Content-Type": "application/json",
        })

        const fetchData = await res.json();
        setCategory(fetchData.category);
        setContent(fetchData.content);
      }

      fetchData();
    }, [])
    
    const handleCreate = () => {
        if(confirm("등록하시겠습니까?")){
            const fetchData = async () => {
                const post = await fetch(`http://localhost:3001/quotes`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        category,
                        content
                    })
                })

                const postData = await post.json()
                console.log(postData);

                const del = await fetch(`http://localhost:3001/create-request/${id}`, {
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
        <Container fluid>
            <Row style={{marginTop: 200}}>
                <Col sm={2}></Col>
                <Col>
                    <Table>
                        <tbody>
                            <tr>
                                <th>분류</th>
                                <td>{category}</td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td>{content}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col sm={2}></Col>
            </Row>

            <Row>
                <Col sm={2}></Col>
                <Col>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleCreate}
                    >등록</Button>{' '}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => router.push("/admin")}
                    >목록</Button>{' '}
                </Col>
                <Col sm={2}></Col>
            </Row>
        </Container>
    )
}