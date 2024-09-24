package com.example.library.controllers;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.model.User;
import com.example.library.payload.response.UserInQueueRowData;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.BookRepository;

import java.util.*;

import com.example.library.services.BookBorrowingService;
import com.example.library.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class BookController {

    @Autowired
    BookRepository bookRepository;
    @Autowired
    BookService bookService;
    @Autowired
    BookBorrowingService bookBorrowingService;
    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    @GetMapping("/books")
    public ResponseEntity<Map<String, Object>> getAllBooksWithPagination(@RequestParam(name="title", defaultValue = "", required = false) String titleLike,
                                                           @RequestParam(name="author", defaultValue = "", required = false) String authorLike,
                                                           @RequestParam(name="description", defaultValue = "", required = false) String descriptionLike,
                                                           @RequestParam(name="genre", defaultValue = "", required = false) String genreLike,
                                                                    @RequestParam(name="yearPublishedMinimum", defaultValue = "1900", required = false) Integer yearPublishedMinimum,
                                                                    @RequestParam(name="yearPublishedMaximum", defaultValue = "2021", required = false) Integer yearPublishedMaximum,
                                                           @RequestParam(name="page", defaultValue = "0") int page,
                                                           @RequestParam(name="size", defaultValue = "3") int size,
                                                           @RequestParam(name="sortCriterium", defaultValue = "") String sortCriterium,
                                                           @RequestParam(name="sortOrder", defaultValue = "") String sortOrder,
                                                           @RequestParam(name="status", defaultValue = "") String status) {

        Pageable booksPageable;

        if (genreLike.equalsIgnoreCase("ALL")) { genreLike = "";}

        switch(sortOrder) {
            case "descending":
                booksPageable = PageRequest.of(page, size, Sort.by(sortCriterium).descending());
                break;
            case "ascending":
                booksPageable = PageRequest.of(page, size, Sort.by(sortCriterium).ascending());
                break;
            default:
                booksPageable = PageRequest.of(page, size);
        }

        Integer yearPublishedMinimumInt = yearPublishedMinimum.intValue();
        Integer yearPublishedMaximumInt = yearPublishedMaximum.intValue();

        Page<Book> pageBooks;
        switch (status) {
            case "borrowed":
                pageBooks = bookRepository.getAllBorrowed(titleLike, authorLike, descriptionLike, genreLike,
                        yearPublishedMinimumInt, yearPublishedMaximumInt, booksPageable);
                break;
            case "available":
                pageBooks = bookRepository.getAllAvailable(titleLike, authorLike, descriptionLike, genreLike,
                        yearPublishedMinimumInt, yearPublishedMaximumInt, booksPageable);
                break;
            default:
                pageBooks = bookRepository.getAllBooks(titleLike, authorLike, descriptionLike, genreLike,
                        yearPublishedMinimumInt, yearPublishedMaximumInt, booksPageable);
        }


        List<Book> books;

        books = pageBooks.getContent();

        Map<String, Object> response = new HashMap<>();



        response.put("books", books);
        response.put("currentPage", pageBooks.getNumber());
        response.put("totalItems", pageBooks.getTotalElements());
        response.put("totalPages", pageBooks.getTotalPages());

        if (books.isEmpty()) {
            response.put("books", null);
            response.put("currentPage", 0);
            response.put("totalItems", 0);
            response.put("totalPages", 0);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable("id") int id) {
        Optional<Book> bookData = bookRepository.findById(id);

        if (bookData.isPresent()) {
            return new ResponseEntity<>(bookData.get(), HttpStatus.OK);
        } else {
            try {
                return new ResponseEntity<>(bookData.get(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

    @GetMapping("/books/allGenres")
    public ResponseEntity<List<String>> getAllBookGenres() {
        List<String> genres = bookService.getAllBookGenres();

        return new ResponseEntity<>(genres, HttpStatus.OK);
    }

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        try {
            Book _book = bookRepository
                    .save(new Book(book.getTitle(),
                            book.getAuthor(),
                            book.getYearPublished(),
                            book.getDescription(),
                            book.getGenre()));
            return new ResponseEntity<>(_book, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable("id") int id, @RequestBody Book book) {
        Optional<Book> bookData = bookRepository.findById(id);

        if (bookData.isPresent()) {
            Book _book = bookData.get();
            _book.setTitle(book.getTitle());
            _book.setAuthor(book.getAuthor());
            _book.setYearPublished(book.getYearPublished());
            _book.setDescription(book.getDescription());
            _book.setGenre(book.getGenre());
            return new ResponseEntity<>(bookRepository.save(_book), HttpStatus.OK);

        } else {
            try {
                return new ResponseEntity<>(bookRepository.save(book), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<HttpStatus> deleteBook(@PathVariable("id") int id) {
        try {
            bookRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/books")
    public ResponseEntity<HttpStatus> deleteAllBooks() {
        try {
            bookRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/book/free/{id}")
    public boolean checkIfFree(@PathVariable("id") int bookId) {
        return bookService.bookFree(bookId);
    }

    @GetMapping("/book/statistic")
    public ResponseEntity<Map<String, Object>> getBookStatistics(@RequestParam long userId, @RequestParam int bookId) {

        return new ResponseEntity<>(bookService.getUserBookStatistics(userId, bookId), HttpStatus.OK);
    }

    @GetMapping("/book/usersInQueue/rowData")
    public List<UserInQueueRowData> bookUsersInQueueDataRows(@RequestParam int bookId) {
        List<BookBorrowing> usersInQueue = bookBorrowingRepository.usersInBookQueue(bookId);

        List<UserInQueueRowData> queueDataRows = new ArrayList<>();
        for (BookBorrowing bb : usersInQueue) {
            User currentUser = bb.getUser();

            UserInQueueRowData currentBorrowingInQueue = new UserInQueueRowData(
                    currentUser.getFirstName(), currentUser.getLastName(), bb.getId().getRequestDate()
            );

            Map<String, Object> userStatistics = bookService.getUserBookStatistics(currentUser.getId(), bookId);

            //All books
            currentBorrowingInQueue.setMeanDaysOfAllBooksPossession(
                    Double.parseDouble(userStatistics.get("meanDaysOfAllBooksPossession").toString())
            );
            currentBorrowingInQueue.setMeanDaysOfReturnDelayAllBooks(
                    Double.parseDouble(userStatistics.get("meanDaysOfReturnDelayAllBooks").toString())
            );
            currentBorrowingInQueue.setMaxDaysOfPossessionAllBooks(
                    Integer.parseInt(userStatistics.get("maxDaysOfPossessionAllBooks").toString())
            );
            currentBorrowingInQueue.setMaxDaysOfReturnDelayAllBooks(
                    Integer.parseInt(userStatistics.get("maxDaysOfReturnDelayAllBooks").toString())
            );

            //This book
            currentBorrowingInQueue.setMeanDaysOfSingleBookPossession(
                    Double.parseDouble(userStatistics.get("meanDaysOfReturnDelaySingleBook").toString())
            );
            currentBorrowingInQueue.setMeanDaysOfReturnDelaySingleBook(
                    Double.parseDouble(userStatistics.get("meanDaysOfSingleBookPossession").toString())
            );
            currentBorrowingInQueue.setMaxDaysOfSingleBookPossession(
                    Integer.parseInt(userStatistics.get("maxDaysOfSingleBookPossession").toString())
            );
            currentBorrowingInQueue.setMaxDaysOfSingleBookReturnDelay(
                    Integer.parseInt(userStatistics.get("maxDaysOfSingleBookReturnDelay").toString())
            );

            currentBorrowingInQueue.setActualBorrowings(bookBorrowingRepository.userActualBorrowings(currentUser.getId()).size());
            currentBorrowingInQueue.setActualRequests(bookBorrowingRepository.userBookRequests(currentUser.getId()).size());

            queueDataRows.add(currentBorrowingInQueue);
        }

        return queueDataRows;
    }
}
