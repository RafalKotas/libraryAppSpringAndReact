package com.example.library.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@Entity
@Table(name = "book_borrowing")
@StaticMetamodel(BookBorrowing.class)
@Setter
@ToString
@NoArgsConstructor
@Getter
public class BookBorrowing {

    @EmbeddedId
    BookBorrowingKey id;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "user_id")
    User user;


    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "book_id")
    Book book;

    Date borrowingDate;

    Date returnDate;

    public BookBorrowing(User user, Book book, Date requestDate, Date borrowingDate) {
        this.user = user;
        this.book = book;
        this.id = new BookBorrowingKey(user.getId(), book.getId(), requestDate);
        this.borrowingDate = borrowingDate;
        this.returnDate = null;
    }
}
