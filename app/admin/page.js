'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthContext"
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import Paging from "../components/Paging"

export default function Admin(){
    const router = useRouter()

    const [createRequestData, setCreateRequestData] = useState([])
    const [updateRequestData, setUpdateRequestData] = useState([])

    const { loggedIn } = useAuth()

    const itemsPerPage = 5; // 한 페이지에 표시할 아이템 개수
    const [currentPage1, setCurrentPage1] = useState(1); // 현재 페이지
    const indexOfLastItem1 = currentPage1 * itemsPerPage; // 마지막
    const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage; // 첫번째
    const currentItems1 = createRequestData.slice(indexOfFirstItem1, indexOfLastItem1);
    const totalPages1 = Math.ceil(createRequestData.length / itemsPerPage); // 전체 페이지

    const [currentPage2, setCurrentPage2] = useState(1); // 현재 페이지
    const indexOfLastItem2 = currentPage2 * itemsPerPage; // 마지막
    const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage; // 첫번째
    const currentItems2 = updateRequestData.slice(indexOfFirstItem2, indexOfLastItem2);
    const totalPages2 = Math.ceil(updateRequestData.length / itemsPerPage); // 전체 페이지

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
        <Container fluid>
            <Row>
                <Row style={{marginTop: 20}}>
                    <Col style={{textAlign: "right"}}>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => router.push("/")}
                        >유저 페이지</Button>
                    </Col>
                </Row>

                <Row style={{marginTop: 20}}>
                    <Col style={{textAlign: "center"}}>
                        <h2>관리자 페이지</h2>
                    </Col>
                </Row>

                <Row style={{marginTop: 50}}>
                    <Col sm={6}>
                        <h3>등록 요청</h3>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr style={{textAlign: "center"}}>
                                    <th>번호</th>
                                    <th>분류</th>
                                    <th>내용</th>
                                    <th>작성자</th>
                                    <th>-</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentItems1.length > 0 ?
                                    currentItems1.map((d) => {
                                        return(
                                            <tr key={d.id} onClick={() => handleCreateRequestDetail(d.id)} style={{cursor: "pointer"}}>
                                                <td width={50} style={{textAlign: "center"}}>{d.id}</td>
                                                <td width={150} style={{textAlign: "center"}}>{d.category}</td>
                                                <td>{d.content}</td>
                                                <td width={150} style={{textAlign: "center"}}>{d.username}</td>
                                                <td width={150} style={{textAlign: "center"}}>
                                                    <Button 
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={(e) => handleCreate(e, d)}
                                                    >등록</Button>{' '}
                                                    <Button 
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={(e) => handleCreateRequestDelete(e, d.id)}
                                                    >삭제</Button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr style={{textAlign: "center"}}><td colSpan={5}>데이터가 없습니다.</td></tr>
                                }
                            </tbody>
                        </Table>
                        
                        <Col style={{display: "flex", justifyContent: 'center'}}>
                            <Paging 
                                totalPages={totalPages1}
                                currentPage={currentPage1}
                                onPageChange={setCurrentPage1}
                            />
                        </Col>
                    </Col>
                    
                    <Col sm={6}>
                        <h3>수정 요청</h3>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr style={{textAlign: "center"}}>
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
                                                <td width={50} style={{textAlign: "center"}}>{d.id}</td>
                                                <td width={150} style={{textAlign: "center"}}>{d.category}</td>
                                                <td>{d.content}</td>
                                                <td width={150} style={{textAlign: "center"}}>{d.username}</td>
                                                <td width={150} style={{textAlign: "center"}}>
                                                    <Button 
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={(e) => handleUpdate(e, d)}
                                                    >수정</Button>{' '}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={(e) => handleUpdateRequestDelete(e, d.id)}
                                                    >삭제</Button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr style={{textAlign: "center"}}><td colSpan={5}>데이터가 없습니다.</td></tr>
                                }
                            </tbody>
                        </Table>

                        <Col style={{display: "flex", justifyContent: 'center'}}>
                            <Paging 
                                totalPages={totalPages2}
                                currentPage={currentPage2}
                                onPageChange={setCurrentPage2}
                            />
                        </Col>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}