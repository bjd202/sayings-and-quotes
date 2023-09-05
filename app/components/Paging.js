import { Pagination } from "react-bootstrap";

export default function Paging({totalPages, currentPage, onPageChange}){
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return(
        <Pagination>
            <Pagination.First onClick={() => onPageChange(1)} />
            {
                Array.from({ length: totalPages }).map((_, index) => (
                    <Pagination.Item 
                        key={index} 
                        active={currentPage === index+1} 
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))
            }
            <Pagination.Last onClick={() => onPageChange(totalPages)} />
        </Pagination>
    )
}