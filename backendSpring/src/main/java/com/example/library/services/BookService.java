package com.example.library.services;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.model.User;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.BookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.specifications.BookOwnedByUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Service
public class BookService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    BookRepository bookRepository;
    @Autowired
    BookBorrowingRepository bookBorrowingRepository;
    @Autowired
    BookBorrowingService bookBorrowingService;

    public BookService() {
    }

    public List<String> getAllBookGenres() {
        return bookRepository.getAllGenres();
    }

    public boolean bookFree(int bookId) {
        try {
            Optional<BookBorrowing> potentialBorrowed = bookBorrowingRepository.findborrowedBook(bookId);
            return potentialBorrowed.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasUserBookWithId(Long userId, int bookId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Book> book = bookRepository.findById(bookId);

        if(user.isPresent() && book.isPresent()) {
            BookBorrowing borrowingForSpecification = new BookBorrowing(user.get(), book.get(), new Date(), new Date());

            BookOwnedByUser spec = new BookOwnedByUser(borrowingForSpecification);
            Optional<BookBorrowing> userBorrowingWithBookId = bookBorrowingRepository.findOne(spec);

            return userBorrowingWithBookId.isPresent();
        } else {
            return false;
        }
    }

    public Map<String, Object> getUserBookStatistics(long userId, int bookId) {
        //all books stats
        double meanDaysOfAllBooksPossession = (double) Math.round(bookBorrowingService.meanDaysOfAllBooksPossession(userId) * 100) / 100;
        double meanDaysOfReturnDelayAllBooks = (double) Math.round(bookBorrowingService.meanDaysOfReturnDelayAllBooks(userId) * 100) / 100;
        int maxDaysOfPossessionAllBooks = bookBorrowingService.maxDaysOfPossessionAllBooks(userId);
        int maxDaysOfReturnDelayAllBooks = bookBorrowingService.maxDaysOfReturnDelayAllBooks(userId);

        //single book stats
        double meanDaysOfReturnDelaySingleBook = (double) Math.round(bookBorrowingService.meanDaysOfReturnDelaySingleBook(userId, bookId) * 100) / 100;
        double meanDaysOfSingleBookPossession = (double) Math.round(bookBorrowingService.meanDaysOfSingleBookPossession(userId, bookId) * 100) / 100;
        int maxDaysOfSingleBookPossession = bookBorrowingService.maxDaysOfSingleBookPossession(userId, bookId);
        int maxDaysOfSingleBookReturnDelay = bookBorrowingService.maxDaysOfSingleBookReturnDelay(userId, bookId);

        Map<String, Object> response = new HashMap<>();

        response.put("meanDaysOfAllBooksPossession", meanDaysOfAllBooksPossession);
        response.put("meanDaysOfReturnDelayAllBooks", meanDaysOfReturnDelayAllBooks);
        response.put("maxDaysOfPossessionAllBooks", maxDaysOfPossessionAllBooks);
        response.put("maxDaysOfReturnDelayAllBooks", maxDaysOfReturnDelayAllBooks);

        response.put("meanDaysOfReturnDelaySingleBook", meanDaysOfReturnDelaySingleBook);
        response.put("meanDaysOfSingleBookPossession", meanDaysOfSingleBookPossession);
        response.put("maxDaysOfSingleBookPossession", maxDaysOfSingleBookPossession);
        response.put("maxDaysOfSingleBookReturnDelay", maxDaysOfSingleBookReturnDelay);

        return response;
    }
}
