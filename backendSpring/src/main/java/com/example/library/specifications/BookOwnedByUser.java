package com.example.library.specifications;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.model.BookBorrowing_;
import com.example.library.model.Book_;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BookOwnedByUser implements Specification {
    private final BookBorrowing bookBorrowing;

    public BookOwnedByUser(BookBorrowing bookBorrowing) {
        this.bookBorrowing = bookBorrowing;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.and(
                criteriaBuilder.equal(root.get(BookBorrowing_.USER), this.bookBorrowing.getUser()),
                criteriaBuilder.equal(root.get(BookBorrowing_.BOOK), this.bookBorrowing.getBook()),
                criteriaBuilder.isNotNull(root.get(BookBorrowing_.BORROWING_DATE)),
                criteriaBuilder.isNull(root.get(BookBorrowing_.RETURN_DATE))
        );
    }
}
