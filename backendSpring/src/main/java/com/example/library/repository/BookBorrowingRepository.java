package com.example.library.repository;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.model.BookBorrowingKey;
import com.example.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Date;
import java.util.Optional;

public interface BookBorrowingRepository extends JpaRepository<BookBorrowing, BookBorrowingKey>, JpaSpecificationExecutor<BookBorrowing> {

    List<BookBorrowing> findByUser(User user);

    List<BookBorrowing> findAll();

    // find if book with given id is borrowed
    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.book_id = :bookId AND b.borrowing_date is NOT NULL AND b.return_date is NULL",
            nativeQuery = true)
    Optional <BookBorrowing> findborrowedBook(@Param("bookId") int bookId);

    // return user' borrowings <0,3>
    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            "AND b.request_date is NOT NULL AND b.borrowing_date is NOT NULL AND b.return_date is NULL",
            nativeQuery = true)
    List <BookBorrowing> userActualBorrowings(@Param("userId") Long userId);


    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            "AND b.request_date is NOT NULL AND b.borrowing_date is NULL AND b.return_date is NULL",
            nativeQuery = true)
    List <BookBorrowing> userBookRequests(@Param("userId") Long userId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId AND b.book_id = :bookId " +
            "AND b.request_date is NOT NULL AND b.borrowing_date is NULL AND b.return_date is NULL",
            nativeQuery = true)
    Optional <BookBorrowing> potentialBookToGiveUser(@Param("bookId") int bookId, @Param("userId") Long userId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId AND b.book_id = :bookId" +
            " AND b.request_date is NOT NULL AND b.borrowing_date is NULL AND b.return_date is NULL",
            nativeQuery = true)
    Optional<BookBorrowing> userInBookQueue(@Param("userId") Long userId, @Param("bookId") int bookId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.book_id = :bookId" +
            " AND b.request_date is NOT NULL AND b.borrowing_date is NULL AND b.return_date is NULL",
            nativeQuery = true)
    List<BookBorrowing> usersInBookQueue(@Param("bookId") int bookId);

    @Query(value = "SELECT * " +
            "FROM book_borrowing b " +
            "WHERE b.user_id = :userId " +
            "ORDER BY request_date LIMIT 1",
            nativeQuery = true)
    Optional<BookBorrowing> getEarliestDate(@Param("userId") Long userId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            "ORDER BY :dateType desc limit 1",
            nativeQuery = true)
    Optional<BookBorrowing> getLatestDate(@Param("userId") Long userId, @Param("dateType") String dateType);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            " AND b.request_date BETWEEN :requestDateLowerBound AND :requestDateUpperBound" +
            " AND b.borrowing_date BETWEEN :borrowingDateLowerBound AND :borrowingDateUpperBound" +
            " AND b.return_date BETWEEN :returnDateLowerBound AND :returnDateUpperBound",
            nativeQuery = true)
    List<BookBorrowing> getAllUserBorrowingsWithDateBoundaries(@Param("userId") Long userId,
                                                            @Param("requestDateLowerBound") Date requestDateLowerBound,
                                                            @Param("requestDateUpperBound") Date requestDateUpperBound,
                                                            @Param("borrowingDateLowerBound") Date borrowingDateLowerBound,
                                                            @Param("borrowingDateUpperBound") Date borrowingDateUpperBound,
                                                            @Param("returnDateLowerBound") Date returnDateLowerBound,
                                                            @Param("returnDateUpperBound") Date returnDateUpperBound);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            " AND b.book_id = :bookId" +
            " AND b.request_date is NOT NULL" +
            " AND b.borrowing_date is NOT NULL" +
            " AND b.return_date is NOT NULL",
            nativeQuery = true)
    List<BookBorrowing> getAllUserBorrowingsWithSpecifiedBookReturned(@Param("userId") Long userId,
                                                               @Param("bookId") int bookId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId" +
            " AND b.request_date is NOT NULL" +
            " AND b.borrowing_date is NOT NULL" +
            " AND b.return_date is NOT NULL",
            nativeQuery = true)
    List<BookBorrowing> getAllUserBorrowingsWithAllBooksReturned(@Param("userId") Long userId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId" +
            " AND b.borrowing_date is NOT NULL",
            nativeQuery = true)
    List<BookBorrowing> userBorrowingsOnHandsOrReturned(@Param("userId") Long userId);

    @Query(value = "SELECT *" +
            " FROM book_borrowing b" +
            " WHERE b.user_id = :userId " +
            " AND b.book_id = :bookId" +
            " AND b.borrowing_date is NOT NULL",
            nativeQuery = true)
    List<BookBorrowing> userBorrowingsOnHandsOrReturnedBookIdSpecified(@Param("userId") Long userId, @Param("bookId") int bookId);


    @Query("SELECT COUNT(b) FROM BookBorrowing b")
    int allBorrowingsCount();

    Long deleteByIdUserId(Long userId);

    List<BookBorrowing> findByIdUserId(Long userId);

    List<BookBorrowing> findByIdBookId(int bookId);

    List<BookBorrowing> findByIdBookIdAndIdUserId(int bookId, Long userId);

    Optional<BookBorrowing> findByIdBookIdAndReturnDate(int bookId, Date returnDate);

    Optional<BookBorrowing> findById(BookBorrowingKey bookBorrowingKey);

    Optional<BookBorrowing> findByIdBookIdAndIdUserIdAndReturnDate(int bookId, Long userId, Date returnDate);
}
