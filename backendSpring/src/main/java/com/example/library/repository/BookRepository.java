package com.example.library.repository;

import java.util.Optional;
import java.util.List;

import com.example.library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor {

    List<Book> findAll();

    Optional<Book> findById(Integer Id);

    @Query(value = "SELECT *" +
            " FROM books" +
            " GROUP BY genre",
            nativeQuery = true)
    List<Book> getAllGenres();

    // all available - page
    @Query(value = "SELECT *" +
            " FROM books b LEFT JOIN book_borrowing r ON b.id = r.book_id" +
            " WHERE (b.genre LIKE %:genre%" +
            " AND b.title LIKE %:title%" +
            " AND b.author LIKE %:author%" +
            " AND b.description LIKE %:description%" +
            " AND b.year_published BETWEEN :yearPublishedMinimum and :yearPublishedMaximum)" +
            " GROUP BY b.id" +
            " HAVING COUNT(r.borrowing_date) = COUNT(r.return_date)",
            nativeQuery = true)
    Page<Book> getAllAvailable(@Param("title") String title,
                               @Param("author") String author,
                               @Param("description") String description,
                               @Param("genre") String genre,
                               @Param("yearPublishedMinimum") Integer yearPublishedMinimum,
                               @Param("yearPublishedMaximum") Integer yearPublishedMaximum,
                               Pageable pageable);

    @Query(value = "SELECT *" +
            " FROM books b LEFT JOIN book_borrowing r ON b.id = r.book_id" +
            " GROUP BY b.id" +
            " HAVING COUNT(r.borrowing_date) = COUNT(r.return_date)",
            nativeQuery = true)
    List<Book> getAllAvailableWithoutParams();

    // all borrowed books
    @Query(value = "SELECT * FROM books b " +
            "LEFT join book_borrowing r " +
            "on b.id = r.book_id " +
            "WHERE r.borrowing_date is not null AND r.return_date is null " +
            "AND b.genre LIKE %:genre% " +
            "AND b.title LIKE %:title% " +
            "AND b.author LIKE %:author% " +
            "AND b.description LIKE %:description% " +
            "AND b.year_published BETWEEN :yearPublishedMinimum AND :yearPublishedMaximum",
            nativeQuery = true)
    Page<Book> getAllBorrowed(@Param("title") String title,
                              @Param("author") String author,
                              @Param("description") String description,
                              @Param("genre") String genre,
                              @Param("yearPublishedMinimum") Integer yearPublishedMinimum,
                              @Param("yearPublishedMaximum") Integer yearPublishedMaximum,
                              Pageable pageable);

    // all books
    @Query(value = "SELECT * FROM books b " +
            "WHERE b.genre LIKE %:genre% " +
            "AND b.title LIKE %:title% " +
            "AND b.author LIKE %:author% " +
            "AND b.description LIKE %:description% " +
            "AND b.year_published BETWEEN :yearPublishedMinimum AND :yearPublishedMaximum",
            nativeQuery = true)
    Page<Book> getAllBooks(@Param("title") String title,
                              @Param("author") String author,
                              @Param("description") String description,
                              @Param("genre") String genre,
                              @Param("yearPublishedMinimum") Integer yearPublishedMinimum,
                              @Param("yearPublishedMaximum") Integer yearPublishedMaximum,
                              Pageable pageable);

    @Query(value = "SELECT * FROM books b " +
            "WHERE b.genre LIKE %:genre% " +
            "AND b.title LIKE %:title% " +
            "AND b.author LIKE %:author% " +
            "AND b.description LIKE %:description% " +
            "AND b.year_published LIKE %:yearPublished%",
            nativeQuery = true)
    Optional<Book> existsBookWithGivenParams(@Param("title") String title,
                                             @Param("author") String author,
                                             @Param("description") String description,
                                             @Param("genre") String genre,
                                             @Param("yearPublished") Integer yearPublished);

    boolean existsBookByTitleAndAuthorAndDescriptionAndGenreAndYearPublished(String title,
                                                                         String author,
                                                                         String description,
                                                                         String genre,
                                                                         Integer yearPublished);

}
