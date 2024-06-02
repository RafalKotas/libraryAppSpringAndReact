package com.example.library.model;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Embeddable
@NoArgsConstructor
public class BookBorrowingKey implements Serializable {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "book_id")
    int bookId;

    @Column(name = "request_date")
    Date requestDate;

    public BookBorrowingKey(Long userId, int bookId, Date requestDate) {
        this.userId = userId;
        this.bookId = bookId;
        this.requestDate = requestDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BookBorrowingKey that = (BookBorrowingKey) o;

        if (!userId.equals(that.userId)) return false;
        return bookId == that.bookId;
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + Long.getLong(Integer.toString(bookId)).hashCode();
        return result;
    }
}
