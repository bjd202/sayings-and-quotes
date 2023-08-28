'use client'

import { useParams, useRouter } from "next/navigation";
import SayingsAndQuotesData from '../../../sayings-and-quotes'

const data = SayingsAndQuotesData;

export default function QuotesDetail(){
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const filteredData = data[parseInt(id)-1]

    const handleList = () => {
        router.push('/')
    }

    return(
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>번호</th>
                        <td>{filteredData.id}</td>
                    </tr>
                    <tr>
                        <th>분류</th>
                        <td>{filteredData.category}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{filteredData.content}</td>
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