package com.example.library.controllers;

import java.util.*;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.model.RequestBodyObjects.PaginationParams;
import com.example.library.model.User;
import com.example.library.model.UserToken.UserToken;
import com.example.library.payload.response.MessageResponse;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.BookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.repository.UserTokenRepository;
import com.example.library.services.BookBorrowingService;
import com.example.library.services.BookService;
import com.example.library.specifications.BookBorrowingSpecifications.SelectedDateUserBorrowingsSpecification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.joda.time.DateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class BookBorrowingController {

    @Autowired
    UserTokenRepository userTokenRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    BookRepository bookRepository;
    @Autowired
    BookService bookService;
    @Autowired
    BookBorrowingService bookBorrowingService;
    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    final String centuryDateBoundaries = "{\"requestDateMinValue\":\"2000-01-01\",\"borrowingDateMinValue\":\"2100-12-31\"," +
            "\"returnDateMinValue\":\"2000-01-01\",\"requestDateMaxValue\":\"2100-12-31\"," +
            "\"borrowingDateMaxValue\":\"2000-01-01\",\"returnDateMaxValue\":\"2100-12-17\"}";

    @GetMapping("/getUserBorrowingsWithFilters")
    public ResponseEntity<?> userBorrowingsWithDateBoundaries(
            @RequestParam(name = "paginationParams", defaultValue = centuryDateBoundaries) String paginationParams,
            @RequestParam(name = "userId", defaultValue = "5") Long userId,
            @RequestParam(name = "status", defaultValue = "ALL") String status,
            @RequestParam(name = "dateBoundaryValues") String dateBoundariesJSON)  throws JsonProcessingException {

        final PaginationParams paginationParams1 =
                new ObjectMapper().readValue(paginationParams, PaginationParams.class);

        Pageable userBookBorrowingsPageable;

        if(status.equals("IN QUEUE") || status.equals("ALL"))
            userBookBorrowingsPageable = PageRequest.of(paginationParams1.getCurrentPage(), paginationParams1.getPageSize(), Sort.by("id.requestDate").descending());
        else
            userBookBorrowingsPageable = PageRequest.of(paginationParams1.getCurrentPage(), paginationParams1.getPageSize(), Sort.by("borrowingDate").descending());

        Page<BookBorrowing> pageBookBorrowings = bookBorrowingService.getUserBorrowingsPage(
                userId, status, dateBoundariesJSON, userBookBorrowingsPageable);

        List<BookBorrowing> bookBorrowings;

        bookBorrowings = pageBookBorrowings.getContent();

        Optional<UserToken> existActiveUserToken = userTokenRepository.activeTokenWithGivenUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("bookBorrowings", bookBorrowings);
        response.put("currentPage", pageBookBorrowings.getNumber());
        response.put("totalItems", pageBookBorrowings.getTotalElements());
        response.put("totalPages", pageBookBorrowings.getTotalPages());

        if(existActiveUserToken.isPresent()) {
            if(pageBookBorrowings.getTotalElements() > 0) {
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                if(bookBorrowingRepository.findByIdUserId(userId).size() > 0) {
                    return ResponseEntity
                            .ok()
                            .body(new MessageResponse("No borrowings with specified filters."));
                } else {
                    return ResponseEntity
                            .ok()
                            .body(new MessageResponse("It is likely that you have not yet borrowed the book or made a request."));
                }
            }
        } else {
            return ResponseEntity
                    .ok()
                    .body(new MessageResponse("ACCOUNT DELETED. Your account has been deleted by someone. We apologize for the inconvenience."));
        }
    }

    @GetMapping("/notNullUserBorrowings")
    public int notNullUserBorrowings(@RequestParam(name = "userId") Long userId,
                                     @RequestParam(name = "dateType", defaultValue = "") String dateType) {

        SelectedDateUserBorrowingsSpecification selectedDateUserBorrowingsSpecification =
                new SelectedDateUserBorrowingsSpecification(dateType, userId);

        List<BookBorrowing> userBorrowings = bookBorrowingRepository.findAll(selectedDateUserBorrowingsSpecification);

        return userBorrowings.size();
    }

    @GetMapping("/earliestUserDate")
    public ResponseEntity<Date>earliestUserDate(@RequestParam(name = "userId") Long userId,
                                     @RequestParam(name = "dateType", defaultValue = "") String dateType) {

        List<BookBorrowing> userBorrowingsSortedAsc = bookBorrowingService.getSortedByDateUserBorrowings(dateType, userId, false);

        if (userBorrowingsSortedAsc.size() > 0) {
            switch(dateType) {
                case "requestDate":
                    return new ResponseEntity<>(userBorrowingsSortedAsc.get(0).getId().getRequestDate(), HttpStatus.OK);
                case "borrowingDate":
                    return new ResponseEntity<>(userBorrowingsSortedAsc.get(0).getBorrowingDate(), HttpStatus.OK);
                case "returnDate":
                    return new ResponseEntity<>(userBorrowingsSortedAsc.get(0).getReturnDate(), HttpStatus.OK);
                default:
                    return new ResponseEntity<>(new Date(), HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(new Date(), HttpStatus.OK);
        }
    }

    @GetMapping("/latestUserDate")
    public ResponseEntity<Date>latestUserDate(@RequestParam(name = "userId") Long userId,
                                @RequestParam(name = "dateType") String dateType) {
        List<BookBorrowing> userBorrowingsSortedDesc = bookBorrowingService.getSortedByDateUserBorrowings(dateType, userId, true);

        if (userBorrowingsSortedDesc.size() > 0) {
            switch(dateType) {
                case "requestDate":
                    return new ResponseEntity<>(userBorrowingsSortedDesc.get(0).getId().getRequestDate(), HttpStatus.OK);
                case "borrowingDate":
                    return new ResponseEntity<>(userBorrowingsSortedDesc.get(0).getBorrowingDate(), HttpStatus.OK);
                case "returnDate":
                    return new ResponseEntity<>(userBorrowingsSortedDesc.get(0).getReturnDate(), HttpStatus.OK);
                default:
                    return new ResponseEntity<>(new Date(), HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(new Date(), HttpStatus.OK);
        }
    }

    @GetMapping("/userInQueue")
    public boolean isUserInBookQueue(@RequestParam(name = "user_id") Long userId,
                                     @RequestParam(name = "book_id") int bookId) {
        return bookBorrowingService.isUserInBookQueue(userId, bookId);
    }

    @GetMapping("/borrowing/actualBorrowingsCount")
    public int userBorrowingsCount(@RequestParam(name = "user_id") Long userId) {
        return bookBorrowingService.userBooksOnHandsCount(userId);
    }

    @GetMapping("/borrowing")
    public boolean maxBorrowingsReached(@RequestParam(name = "user_id") Long userId) {
        return bookBorrowingService.maximumBooksOnHandsReached(userId);
    }

    @GetMapping("/borrowing/{bookId}")
    public int getBorrowingsWithBookId(@PathVariable("bookId") int bookId) {
        List<BookBorrowing> borrowingsWithBookId = bookBorrowingRepository.findByIdBookId(bookId);
        return borrowingsWithBookId.isEmpty() ? 0 : borrowingsWithBookId.size();
    }

    @GetMapping("/borrowing/actual")
    public int existActualBorrowingWithBookId(@RequestParam("book_id") int bookId) {
        if(getBorrowingsWithBookId(bookId) > 0) {
            Optional<BookBorrowing> potentialActualBorrowing = bookBorrowingRepository.findByIdBookIdAndReturnDate(bookId, null);
            return potentialActualBorrowing.isPresent() ? 1 : 0;
        } else {
            return 0;
        }
    }

    @GetMapping("/borrowing/actual/{user}/{book}")
    public boolean hasUserBookWithId(@PathVariable("user") Long userId,
                                     @PathVariable("book") int bookId) {
        return bookService.hasUserBookWithId(userId, bookId);
    }

    @GetMapping("/borrowing/onHands")
    public ResponseEntity<List<BookBorrowing>> getUserBookOnHands(@RequestParam("userId") Long userId) {
        List<BookBorrowing> userBookOnHands = bookBorrowingRepository.userActualBorrowings(userId);

        return new ResponseEntity<>(userBookOnHands, HttpStatus.OK);
    }

    @GetMapping("/borrowings/inQueue")
    public ResponseEntity<List<BookBorrowing>> getUserBookRequests(@RequestParam("userId") Long userId)
    {
        List<BookBorrowing> userBookRequests = bookBorrowingRepository.userBookRequests(userId);

        return new ResponseEntity<>(userBookRequests, HttpStatus.OK);
    }

    @GetMapping("/borrowings/inQueueLength")
    public int getUserRequestCount(@RequestParam("userId") Long userId) {
        List<BookBorrowing> userBookRequests = bookBorrowingRepository.userBookRequests(userId);

        return userBookRequests.size();
    }

    @GetMapping("/borrowings/usersInQueue")
    public ResponseEntity<List<BookBorrowing>> getUsersInBookQueue(@RequestParam("bookId") int bookId)
    {
        List<BookBorrowing> usersInQueue = bookBorrowingRepository.usersInBookQueue(bookId);

        return new ResponseEntity<>(usersInQueue, HttpStatus.OK);
    }



    @GetMapping("/borrowings/usersInQueue/length")
    public int getBookQueueLength(@RequestParam("bookId") int bookId)
    {
        List<BookBorrowing> usersInQueue = bookBorrowingRepository.usersInBookQueue(bookId);

        return usersInQueue.size();
    }

    @DeleteMapping("/borrowing")
    public ResponseEntity<HttpStatus> deleteBook(@RequestParam("book_id") int id) {
        try {
            List<BookBorrowing> borrowingsWithBookId = bookBorrowingRepository.findByIdBookId(id);

            if(getBorrowingsWithBookId(id) > 0) {
                bookBorrowingRepository.deleteAll(borrowingsWithBookId);
            }

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/borrowing/{userId}/{bookId}")
    public ResponseEntity<?> returnBook(@PathVariable("userId") Long userId,
                                        @PathVariable("bookId") int bookId) {

        Optional<BookBorrowing> borrowingWithReturningBook = bookBorrowingRepository.
                findByIdBookIdAndIdUserIdAndReturnDate(bookId, userId,null);

        if(borrowingWithReturningBook.isPresent()) {
            borrowingWithReturningBook.get().setReturnDate(new Date());

            bookBorrowingRepository.save(borrowingWithReturningBook.get());

            return new ResponseEntity<>(borrowingWithReturningBook.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/giveBook")
    public ResponseEntity<?> giveBookToUser(@RequestParam(name = "book_id") int bookId,
                                            @RequestParam(name = "user_id") Long userId) {
        boolean bookFree = bookService.bookFree(bookId);

        if(bookFree) {
            Optional<BookBorrowing> userRequestWithBookToGive = bookBorrowingRepository
                    .potentialBookToGiveUser(bookId, userId);
            if(userRequestWithBookToGive.isPresent()) {
                BookBorrowing requestWithBookToGive = userRequestWithBookToGive
                        .get();
                requestWithBookToGive.setBorrowingDate(new Date());
                bookBorrowingRepository.save(requestWithBookToGive);
                return new ResponseEntity<>(requestWithBookToGive, HttpStatus.CREATED);
            }
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/borrowing")
    public ResponseEntity<?> borrowBook(@RequestParam(name = "book_id") int bookId,
                                                    @RequestParam(name = "user_id") Long userId) {
        try {
            Optional<User> _user = userRepository.findById(userId);
            Optional<Book> _book = bookRepository.findById(bookId);

            boolean bookFree = bookService.bookFree(bookId);

            Date borrowingDate = null;

            if(bookFree) {
                borrowingDate = new Date();
            }

            boolean maximumBorrowingsReached = bookBorrowingService.maximumBooksOnHandsReached(userId);

            BookBorrowing _bookBorrowing = null;
            boolean userCanBorrowTheBook = !maximumBorrowingsReached && _book.isPresent();

            if(userCanBorrowTheBook) {
                _bookBorrowing = bookBorrowingRepository.save(new BookBorrowing(_user.get(), _book.get(), new Date(), borrowingDate));
                return new ResponseEntity<>(_bookBorrowing, HttpStatus.CREATED);
            } else if(!isUserInBookQueue(userId, bookId)) {
                _bookBorrowing = bookBorrowingRepository.save(new BookBorrowing(_user.get(), _book.get(), new Date(), null));
                return new ResponseEntity<>(_bookBorrowing, HttpStatus.CREATED);
            }

            // "User has reached the limit of borrowed books! (3)"
            return new ResponseEntity<>(_bookBorrowing, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
