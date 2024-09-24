package com.example.library.services;

import com.example.library.model.BookBorrowing;
import com.example.library.model.RequestBodyObjects.DateBoundaryValues;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.specifications.BookBorrowingSpecifications.BoundaryBorrowingDateValueForUserSpecification;
import com.example.library.specifications.UserBorrowingsSpecification.UserBorrowingStatusInQueueSpecification;
import com.example.library.specifications.UserBorrowingsSpecification.UserBorrowingStatusOnHandsSpecification;
import com.example.library.specifications.UserBorrowingsSpecification.UserBorrowingStatusReturnedSpecification;
import com.example.library.specifications.UserBorrowingsSpecification.UserBorrowingsStatusAllSpecification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.example.library.services.BookServiceConstants.MAXIMUM_BORROWINGS;
import static com.example.library.services.BookServiceConstants.POSSESSION_DAYS_ACCEPTED;

@Slf4j
@Service
public class BookBorrowingService {

    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    public boolean isUserInBookQueue(Long userId, int bookId) {
        Optional<BookBorrowing> userInQueueEntry = bookBorrowingRepository.userInBookQueue(userId, bookId);

        return userInQueueEntry.isPresent();
    }

    public int userBooksOnHandsCount(Long userId) {
        List<BookBorrowing> userBookOnHands = bookBorrowingRepository.userActualBorrowings(userId);

        return userBookOnHands.size();
    }

    public boolean maximumBooksOnHandsReached(Long userId) {
        int booksOnHands = this.userBooksOnHandsCount(userId);

        return booksOnHands == MAXIMUM_BORROWINGS;
    }

    public List<BookBorrowing> getSortedByDateUserBorrowings(String dateColumn, Long userId, boolean latestOnTop) {
        BoundaryBorrowingDateValueForUserSpecification boundaryBorrowingDateValueForUserSpecification =
                new BoundaryBorrowingDateValueForUserSpecification(dateColumn, userId, latestOnTop);

        return bookBorrowingRepository.findAll(boundaryBorrowingDateValueForUserSpecification);
    }

    public Page<BookBorrowing> getUserBorrowingsPage(Long userId,
                                                 String status,
                                                 String dateBoundariesJSON,
                                                 Pageable userBookBorrowingsPageable) throws JsonProcessingException {

        final DateBoundaryValues dateBoundaryValues1 =
                new ObjectMapper().readValue(dateBoundariesJSON, DateBoundaryValues.class);

        Date requestDateMinValue = DateTime.parse(dateBoundaryValues1.getRequestDateMinValue()).toDate();
        Date requestDateMaxValue = DateTime.parse(dateBoundaryValues1.getRequestDateMaxValue()).plusDays(1).toDate();
        Date borrowingDateMinValue = DateTime.parse(dateBoundaryValues1.getBorrowingDateMinValue()).toDate();
        Date borrowingDateMaxValue = DateTime.parse(dateBoundaryValues1.getBorrowingDateMaxValue()).plusDays(1).toDate();
        Date returnDateMinValue = DateTime.parse(dateBoundaryValues1.getReturnDateMinValue()).toDate();
        Date returnDateMaxValue = DateTime.parse(dateBoundaryValues1.getReturnDateMaxValue()).plusDays(1).toDate();

        BookStatus selectedBookStatus = BookStatus.valueOf(status);

        Specification<BookBorrowing> borrowingSpecification;

        switch(selectedBookStatus) {
            case IN_QUEUE:
                log.info("Get queued books for user {}", userId);
                borrowingSpecification = new UserBorrowingStatusInQueueSpecification(userId, requestDateMinValue, requestDateMaxValue);
                break;
            case ON_HANDS:
                log.info("Get actually borrowed books for user {}", userId);
                borrowingSpecification = new UserBorrowingStatusOnHandsSpecification(userId, requestDateMinValue, requestDateMaxValue,
                                borrowingDateMinValue, borrowingDateMaxValue);
                break;
            case RETURNED:
                log.info("Get returned books for user {}", userId);
                borrowingSpecification = new UserBorrowingStatusReturnedSpecification(userId, requestDateMinValue, requestDateMaxValue,
                                borrowingDateMinValue, borrowingDateMaxValue, returnDateMinValue, returnDateMaxValue);
                break;
            default:
                borrowingSpecification =
                        new UserBorrowingsStatusAllSpecification(userId, requestDateMinValue, requestDateMaxValue,
                                borrowingDateMinValue, borrowingDateMaxValue, returnDateMinValue, returnDateMaxValue);
        }

        return bookBorrowingRepository.findAll(borrowingSpecification,
                userBookBorrowingsPageable);
    }

    // Single books statistics - BEGIN

    public double meanDaysOfReturnDelaySingleBook(Long userId, int bookId) {
        List<BookBorrowing> userSingleBookBorrowings =
                bookBorrowingRepository.getAllUserBorrowingsWithSpecifiedBookReturned(userId, bookId);

        int borrowingsCount = userSingleBookBorrowings.size();

        log.info("book ({}) borrowed: {} times by user({}).", bookId, borrowingsCount, userId);

        int delayDaysSum = 0;
        int singleBookDaysDelay;

        double meanDaysOfReturnDelay = 0;

        if(borrowingsCount > 0) {

            for (BookBorrowing bb: userSingleBookBorrowings) {
                String borrowingDateString = bb.getBorrowingDate().toString().substring(0, 10);
                DateTime borrowingDate = DateTime.parse(borrowingDateString);

                String returnDateString = bb.getReturnDate().toString().substring(0, 10);
                DateTime returnDate = DateTime.parse(returnDateString);

                Days datesDayDiff = Days.daysBetween(borrowingDate, returnDate);

                singleBookDaysDelay = Math.max(datesDayDiff.getDays() - POSSESSION_DAYS_ACCEPTED, 0);
                delayDaysSum += singleBookDaysDelay;
            }

            meanDaysOfReturnDelay = (double) delayDaysSum / borrowingsCount;
        }

        log.info("Book ({}) mean return after time delay: {}.", bookId, meanDaysOfReturnDelay);

        return meanDaysOfReturnDelay;
    }

    public double meanDaysOfSingleBookPossession(Long userId, int bookId) {
        List<BookBorrowing> userSingleBookBorrowings =
                bookBorrowingRepository.findByIdBookIdAndIdUserId(bookId, userId);

        int singleBookDaysOfPossessionAtOnePeriod;
        int singleBookPossessionTimeTotal = 0;

        int borrowingsCount = userSingleBookBorrowings.size();

        double meanDaysOfPossessionSingleBook = 0;

        if(borrowingsCount > 0) {

            for (BookBorrowing bb: userSingleBookBorrowings) {
                Date borrowingDate = bb.getBorrowingDate();
                if(borrowingDate != null) {
                    String borrowingDateString = bb.getBorrowingDate().toString().substring(0, 10);
                    DateTime borrowingDateParsed = DateTime.parse(borrowingDateString);

                    Date returnDate = bb.getReturnDate();
                    String returnDateString = returnDate == null ? DateTime.now().toString()
                            : returnDate.toString().substring(0, 10);
                    DateTime returnDateParsed = DateTime.parse(returnDateString);

                    Days datesDayDiff = Days.daysBetween(borrowingDateParsed, returnDateParsed);

                    singleBookDaysOfPossessionAtOnePeriod = datesDayDiff.getDays();
                    singleBookPossessionTimeTotal += singleBookDaysOfPossessionAtOnePeriod;
                }
            }

            meanDaysOfPossessionSingleBook = (double) singleBookPossessionTimeTotal / borrowingsCount;
        }

        log.info("Mean days of possession, book({}) user({}) : {}",
                bookId, userId, meanDaysOfPossessionSingleBook);

        return meanDaysOfPossessionSingleBook;
    }

    /***
     * @param userId - user unique Id
     * @param bookId - book unique Id
     * @return max time of book possession in days
     */
    public int maxDaysOfSingleBookPossession(long userId, int bookId) {
        List<BookBorrowing> userSingleBookBorrowings =
                bookBorrowingRepository.userBorrowingsOnHandsOrReturnedBookIdSpecified(userId, bookId);

        int maxDays = 0;
        Date borrowingDate;
        String borrowingDateString;
        DateTime borrowingDateParsed;
        Date returnDate;
        String returnDateString;
        DateTime returnDateParsed;
        Days datesDayDiff;

        for (BookBorrowing bb: userSingleBookBorrowings) {
            borrowingDate = bb.getBorrowingDate();
            borrowingDateString = borrowingDate.toString().substring(0, 10);
            borrowingDateParsed = DateTime.parse(borrowingDateString);

            returnDate = bb.getReturnDate();
            returnDateString = returnDate == null ? DateTime.now().toString() : returnDate.toString().substring(0, 10);
            returnDateParsed = DateTime.parse(returnDateString);

            datesDayDiff = Days.daysBetween(borrowingDateParsed, returnDateParsed);

            maxDays = Math.max(datesDayDiff.getDays(), maxDays);
        }

        return maxDays;
    }

    public int maxDaysOfSingleBookReturnDelay(long userId, int bookId) {
        return Math.max(maxDaysOfSingleBookPossession(userId, bookId) - POSSESSION_DAYS_ACCEPTED, 0);
    }

    // Single books statistics - END

    // All books statistics - BEGIN

    public double meanDaysOfReturnDelayAllBooks(Long userId) {
        List<BookBorrowing> userSingleBookBorrowings =
                bookBorrowingRepository.getAllUserBorrowingsWithAllBooksReturned(userId);

        int borrowingsCount = userSingleBookBorrowings.size();

        log.info("Books borrowed: {} times by user({}).", borrowingsCount, userId);

        int delayDaysSum = 0;
        int singleBookDaysDelay;

        double meanDaysOfReturnDelay = 0;

        String borrowingDateString;
        DateTime borrowingDate;
        String returnDateString;
        DateTime returnDate;
        Days datesDayDiff;

        if(borrowingsCount > 0) {
            for (BookBorrowing bb: userSingleBookBorrowings) {
                borrowingDateString = bb.getBorrowingDate().toString().substring(0, 10);
                borrowingDate = DateTime.parse(borrowingDateString);

                returnDateString = bb.getReturnDate().toString().substring(0, 10);
                returnDate = DateTime.parse(returnDateString);

                datesDayDiff = Days.daysBetween(borrowingDate, returnDate);

                singleBookDaysDelay = Math.max(datesDayDiff.getDays() - POSSESSION_DAYS_ACCEPTED, 0);
                delayDaysSum += singleBookDaysDelay;
            }

            meanDaysOfReturnDelay = (delayDaysSum * 1.0) / borrowingsCount;
        }

        return meanDaysOfReturnDelay;
    }

    public double meanDaysOfAllBooksPossession(long userId) {
        List<BookBorrowing> userBooksBorrowings =
                bookBorrowingRepository.userBorrowingsOnHandsOrReturned(userId);

        int booksDaysOfPossessionAtOnePeriod;
        int booksDaysOfPossessionTimeTotal = 0;

        int borrowingsCount = userBooksBorrowings.size();

        double meanDaysOfBooksPossession = 0;

        Date borrowingDate;
        String borrowingDateString;
        DateTime borrowingDateParsed;

        Date returnDate;
        String returnDateString;
        DateTime returnDateParsed;

        Days datesDayDiff;

        if(borrowingsCount > 0) {
            for (BookBorrowing bb: userBooksBorrowings) {
                borrowingDate = bb.getBorrowingDate();
                if(borrowingDate != null) {
                    borrowingDateString = bb.getBorrowingDate().toString().substring(0, 10);
                    borrowingDateParsed = DateTime.parse(borrowingDateString);

                    returnDate = bb.getReturnDate();
                    returnDateString = returnDate == null ? DateTime.now().toString()
                            : returnDate.toString().substring(0, 10);
                    returnDateParsed = DateTime.parse(returnDateString);

                    datesDayDiff = Days.daysBetween(borrowingDateParsed, returnDateParsed);

                    booksDaysOfPossessionAtOnePeriod = datesDayDiff.getDays();
                    booksDaysOfPossessionTimeTotal += booksDaysOfPossessionAtOnePeriod;
                }
            }

            meanDaysOfBooksPossession = (booksDaysOfPossessionTimeTotal * 1.0) / borrowingsCount;
        }

        log.info("Mean days of possession, user({}) : {}", userId, meanDaysOfBooksPossession);

        return meanDaysOfBooksPossession;
    }

    public int maxDaysOfPossessionAllBooks(long userId) {
        List<BookBorrowing> userBooksBorrowings =
                bookBorrowingRepository.userBorrowingsOnHandsOrReturned(userId);

        int maxDays = 0;

        Date borrowingDate;
        String borrowingDateString;
        DateTime borrowingDateParsed;

        Date returnDate;
        String returnDateString;
        DateTime returnDateParsed;

        Days datesDayDiff;

        for (BookBorrowing bb: userBooksBorrowings) {
            borrowingDate = bb.getBorrowingDate();

            borrowingDateString = borrowingDate.toString().substring(0, 10);
            borrowingDateParsed = DateTime.parse(borrowingDateString);

            returnDate = bb.getReturnDate();
            returnDateString = returnDate == null ? DateTime.now().toString()
                        : returnDate.toString().substring(0, 10);
            returnDateParsed = DateTime.parse(returnDateString);

            datesDayDiff = Days.daysBetween(borrowingDateParsed, returnDateParsed);

            maxDays = Math.max(datesDayDiff.getDays(), maxDays);
        }

        return maxDays;
    }

    public int maxDaysOfReturnDelayAllBooks(long userId) {
        return maxDaysOfPossessionAllBooks(userId) - POSSESSION_DAYS_ACCEPTED;
    }

    // All books statistics - END
}
