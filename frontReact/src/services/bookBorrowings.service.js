import http from "../http-common";

class BookBorrowingsService {
    borrowBook = (userId, bookId) => {
        return http.post(`/borrowing/?user_id=${userId}&book_id=${bookId}`)
    }

    giveBook = (userId, bookId) => {
        return http.post(`/giveBook/?user_id=${userId}&book_id=${bookId}`)
    }

    returnBook = (userId, bookId) => {
        return http.post(`/borrowing/${userId}/${bookId}`)
    }

    getBookQueue = (bookId) => {
        return http.get(`/borrowings/usersInQueue/?bookId=${bookId}`)
    }

    getBookUsersInQueueDataRows = (bookId) => {
        return http.get(`/book/usersInQueue/rowData/?bookId=${bookId}`)
    }

    getBookQueueLength = (bookId) => {
        return http.get(`/borrowings/usersInQueue/length/?bookId=${bookId}`)
    }

    existBorrowingsWithBookId = (bookId) => {
        return http.get(`/borrowing/${bookId}`)
    }

    userActualBorrowings = (userId) => {
        return http.get(`/borrowing/onHands/?userId=${userId}`)
    }

    userActualBorrowingsCount = (userId) => {
        return http.get(`/borrowing/actualBorrowingsCount/?user_id=${userId}`)
    }

    userMaxBooksCheck = (userId) => {
        return http.get(`/borrowing/?user_id=${userId}`);
    }

    userInBookQueue = (userId, bookId) => {
        return http.get(`/userInQueue/?user_id=${userId}&book_id=${bookId}`)
    }

    userBookRequests = (userId) => {
        return http.get(`/borrowings/inQueue/?userId=${userId}`)
    }

    userBookRequestsCount = (userId) => {
        return http.get(`/borrowings/inQueueLength/?userId=${userId}`)
    }

    checkIfUserHasAlreadyBook = (userId, bookId) => {
        return http.get(`/borrowing/actual/${userId}/${bookId}`)
    }

    getEarliestUserBorrowingDate = (userId, dateType) => {
        return http.get(`/earliestUserDate/?userId=${userId}&dateType=${dateType}`)
    }

    getLatestUserBorrowingDate = (userId, dateType) => {
        return http.get(`/latestUserDate/?userId=${userId}&dateType=${dateType}`)
    }

    getUserBorrowingsWithPagination = (userId, paginationParams, 
        status, dateBoundaryValues) => {

        if(dateBoundaryValues) {
                return http.get(`/getUserBorrowingsWithFilters?status=${status}&userId=${userId}`, 
                {
                    params: {
                        dateBoundaryValues: dateBoundaryValues,
                        paginationParams: paginationParams
                    }
                })
        }
    }

    deleteBorrowingsWithBookId = (bookId) => {
        return http.delete(`/borrowing/?book_id=${bookId}`)
    }
}

let bookBorrowingService = new BookBorrowingsService();
export default bookBorrowingService;