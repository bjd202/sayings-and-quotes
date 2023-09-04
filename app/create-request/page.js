'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthContext"
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap"

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
                content,
                "username": localStorage.getItem("username")
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("등록 요청이 정상적으로 처리되었습니다.");
            router.push("/");
        })
        .catch(err => console.log(err))
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
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                    />
                                </td>
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
                        onClick={handleCreateRequest}
                    >등록 요청</Button>{' '}
                    <Button
                        variant="outline-primary"
                        onClick={handleList}
                    >목록</Button>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </Container>
    )
}