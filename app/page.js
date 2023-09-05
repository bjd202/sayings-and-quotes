'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'
import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap'
import Paging from './components/Paging'

export default function Home() {

  const router = useRouter()

  const [data, setData] = useState([])
  const [randomText, setRandomText] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [category, setCategory] = useState([])

  // 검색 관련
  const [searchText, setSearchText] = useState("")
  const [currentCategory, setCurrentCategory] = useState("")

  // 페이징 관련
  const itemsPerPage = 10; // 한 페이지에 표시할 아이템 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const indexOfLastItem = currentPage * itemsPerPage; // 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 첫번째
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // 전체 페이지

  const { loggedIn, logout } = useAuth()

  useEffect(() => {
    console.log(loggedIn);
    if(!loggedIn){
      router.push("/login");
    }
  }, [])
  

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/quotes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      const fetchData = await res.json();
      setData(fetchData);
      setFilteredData(fetchData);

      const random = Math.floor(Math.random() * (fetchData.length-1));
      console.log(random);
      setRandomText(fetchData[random].content);
  
      const categories = fetchData.map(s => s.category);
      const uniqueCategorries = [...new Set(categories)];
      // console.log(uniqueCategorries);
      setCategory(uniqueCategorries);
    }

    fetchData();

  }, [])

  const handleSearchText = () => {
    console.log(searchText);
    console.log(currentCategory);

    const searchData = data.filter(s => {
      if (currentCategory === "") {
        return s.category.includes(searchText) || s.content.includes(searchText)
      }else if(currentCategory === "내용"){
        return s.content.includes(searchText)
      }else{
        return s.category === currentCategory && s.content.includes(searchText)
      }
    })

    console.log(searchData);

    setFilteredData(searchData);
  }

  const changeRandomText = () => {
    const random = Math.floor(Math.random() * (data.length-1));
    setRandomText(data[random].content);
  }
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTr = (id) => {
    router.push(`/quote/${id}`);
  }

  const handleCreateRequest = () => {
    router.push("/create-request");
  }

  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push("/login");
  }

  const handleAdminPage = () => {
    router.push("/admin");
  }

  return (
    <Container fluid>
      <Row style={{marginTop: 20}}>
        <Row>
          <Col style={{textAlign: 'right'}}>
            <Button
              variant="outline-primary" 
              size="sm"
              onClick={handleLogout}
            >
              로그아웃
            </Button>{' '}
            {
              localStorage.getItem("username") === "admin" ? 
              (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleAdminPage}>관리자 페이지</Button>
              )
              : null
            }
          </Col>
        </Row>

        <Row style={{marginTop: 20}}>
          <Col sm={4}></Col>
          <Col style={{textAlign: 'center'}}>
            <h1>명언 및 인용구 컬렉션</h1>
          </Col>
          <Col></Col>
        </Row>

        <Row style={{marginTop: 20}}>
          <Col sm={2}></Col>
          <Col style={{textAlign: 'center'}}>
            <Row>
              <h3>{randomText}</h3>
            </Row>
          </Col>

          <Col sm={2}>
            
          </Col>
        </Row>

        <Row>
          <Col style={{textAlign: 'center'}}>
            <Button 
              variant='outline-primary'
              size="sm"
              onClick={changeRandomText}
            >다른 명언 보기</Button>
          </Col>
        </Row>

        <Row style={{marginTop: 40}}>
          <Col sm={2}>
            <Form.Select onChange={e => setCurrentCategory(e.target.value)}>
              <option value="">전체</option>
              <option value="내용">내용</option>
              {
                category.map(c => {
                  return(
                    <option key={c} value={c}>{c}</option>
                  )
                })
              }
            </Form.Select>
          </Col>
          <Col sm={3}>
              <Form.Control 
                type='text'
                placeholder="검색" 
                value={searchText} 
                onChange={e => setSearchText(e.target.value)} 
              />
          </Col>
          <Col>
            <Button 
              variant='outline-primary'
              // size='sm'
              onClick={handleSearchText}
            >검색</Button> {' '}
            <Button 
              variant='outline-primary'
              // size='sm'
              onClick={handleCreateRequest}
            >등록 요청</Button>
          </Col>
        </Row>

        <Row style={{marginTop: 20, height: 370}}>
          <Col>
            <Table striped bordered hover size="sm">
              <thead>
                <tr style={{textAlign: 'center'}}>
                  <td>번호</td>
                  <td>분류</td>
                  <td>내용</td>
                </tr>
              </thead>
              <tbody>
                {
                  currentItems.length > 0 ?
                  currentItems.map(s => {
                    return(
                      <tr key={s.id} onClick={() => handleTr(s.id)} style={{cursor: 'pointer'}}>
                        <td width={100} style={{textAlign: 'center'}}>{s.id}</td>
                        <td width={200} style={{textAlign: 'center'}}>{s.category}</td>
                        <td>{s.content}</td>
                      </tr>
                    )
                  }) : <tr>
                    <td colSpan={3}>데이터가 없습니다.</td>
                  </tr>
                }
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col sm={4}></Col>
          <Col style={{display: 'flex', justifyContent: 'center'}}>
            <Paging
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Col>
          <Col></Col>
        </Row>
      </Row>
    </Container>
  )
}
