'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

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
    <div>

      <div>
        <button onClick={handleLogout}>로그아웃</button>
        {
          localStorage.getItem("username") === "admin" ? 
          (<button onClick={handleAdminPage}>관리자 페이지</button>)
          : null
        }
      </div>

      <div>
        <h1>명언 및 인용구 컬렉션</h1>
      </div>

      <div>
        <h3>{randomText}</h3>
        <button onClick={changeRandomText}>다른 명언 보기</button>
      </div>

      <div>
        <select onChange={e => setCurrentCategory(e.target.value)}>
          <option value="">전체</option>
          <option value="내용">내용</option>
          {
            category.map(c => {
              return(
                <option key={c} value={c}>{c}</option>
              )
            })
          }
        </select>
        <input 
          type="text" 
          placeholder="검색" 
          value={searchText} 
          onChange={e => setSearchText(e.target.value)} 
        />
        <button onClick={handleSearchText}>검색</button>
        <button onClick={handleCreateRequest}>등록 요청</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
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
                    <td>{s.id}</td>
                    <td>{s.category}</td>
                    <td>{s.content}</td>
                  </tr>
                )
              }) : <tr>
                <td colSpan={3}>데이터가 없습니다.</td>
              </tr>
            }
          </tbody>
        </table>

        <div>
          {
            Array.from({ length: totalPages }).map((_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            ))
          }
        </div>
      </div>

    </div>
  )
}
