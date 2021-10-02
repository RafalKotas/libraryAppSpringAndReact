package com.example.library.specifications;

import com.example.library.model.BookBorrowing;
import com.example.library.model.BookBorrowingKey_;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BorrowingWithBookIdSpecification implements Specification {
    private final BookBorrowing bookBorrowing;

    public BorrowingWithBookIdSpecification(BookBorrowing bookBorrowing) {
        this.bookBorrowing = bookBorrowing;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.equal(root.get(BookBorrowingKey_.BOOK_ID), this.bookBorrowing.getId().getBookId());

    }
}
