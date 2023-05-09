import http from "../http-common"

class BookDataService {

    bookAvailable = (bookId) => {
        return http.get(`/book/free/${bookId}`)
    }

    getAllWithPagination = (params) => {
        console.log("params:");
        console.log(params);
        return http.get("/books", { params });
    };

    getBookStatsForUser = (userId, bookId) => {
        return http.get(`/book/statistic/?userId=${userId}&bookId=${bookId}`);
    }

    getBook(bookId) {
        return http.get(`/books/${bookId}`);
    }

    getAllBookGenres() {
        return http.get(`/books/allGenres`);
    }

    create(data) {
        return http.post("/books", data);
    }

    update(bookId, data) {
        return http.put(`/books/${bookId}`, data);
    }

    delete(bookId) {
        return http.delete(`/books/${bookId}`);
    }

    deleteAll() {
        return http.delete(`/books`);
    }
}

let bookDataService = new BookDataService();
export default bookDataService