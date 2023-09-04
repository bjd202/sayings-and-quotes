'use client'

import { useAuth } from "@/app/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";


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
        <Container fluid>
            <Row style={{marginTop: 200}}>
              <Col sm={2}></Col>
              <Col>
                <Table>
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
                </Table>
              </Col>
              <Col sm={2}></Col>
            </Row>

            <Row>
              <Col sm={2}></Col>
              <Col>
                <Button 
                  variant="outline-primary"
                  onClick={() => setIsUpdateRequest(!isUpdateRequest)}
                >수정 요청</Button>{' '}
                <Button 
                  variant="outline-primary"
                  onClick={handleList}
                >목록</Button>
              </Col>
              <Col sm={2}></Col>
            </Row>


            <Modal show={isUpdateRequest} onHide={() => setIsUpdateRequest(false)}>
              <Modal.Header closeButton>
                <Modal.Title>수정 요청</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>분류</Form.Label>
                    <Form.Control
                      type="text"
                      value={category}
                      onChange={e => setCategory(e.target.value)} 
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                      type="text"
                      value={content} 
                      onChange={e => setContent(e.target.value)} 
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>수정 요청 사유</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={description} 
                      onChange={e => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setIsUpdateRequest(false);
                    handleUpdateRequest();
                  }} 
                >
                  수정 요청
                </Button>
                <Button variant="secondary" onClick={() => setIsUpdateRequest(false)}>
                  닫기
                </Button>
              </Modal.Footer>
            </Modal>
            {
              isUpdateRequest ? (
                <Modal>
                  <Modal.Header>
                    <Modal.Title>수정 요청</Modal.Title>
                  </Modal.Header>
                </Modal>

                // <div>
                //   <div>
                //     <table>
                //       <tbody>
                //         <tr>
                //           <th>번호</th>
                //             <td>{data.id}</td>
                //           </tr>
                //           <tr>
                //             <th>분류</th>
                //             <td>
                //               <input 
                //                 type="text" 
                //                 value={category} 
                //                 onChange={e => setCategory(e.target.value)} 
                //                 style={{width: 300}}
                //               />
                //             </td>
                //           </tr>
                //           <tr>
                //             <th>내용</th>
                //             <td>
                //               <input 
                //                 type="text" 
                //                 value={content} 
                //                 onChange={e => setContent(e.target.value)} 
                //                 style={{width: 300}}
                //               />
                //             </td>
                //           </tr>
                //           <tr>
                //             <th>수정 요청 사유</th>
                //             <td>
                //               <textarea 
                //                 value={description} 
                //                 onChange={e => setDescription(e.target.value)}
                //                 style={{width: 300, height: 100}}
                //               />
                //             </td>
                //           </tr>
                //       </tbody>
                //     </table>
                //   </div>

                //   <div>
                //     <button onClick={handleUpdateRequest}>수정 요청</button>
                //   </div>

                // </div>
              ) : null
            }

            
        </Container>
    )
}