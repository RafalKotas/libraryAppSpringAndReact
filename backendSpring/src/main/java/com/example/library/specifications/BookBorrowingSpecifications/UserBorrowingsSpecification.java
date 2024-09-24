package com.example.library.specifications.BookBorrowingSpecifications;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class UserBorrowingsSpecification implements Specification<BookBorrowing> {

    private final Long userId;

    public UserBorrowingsSpecification(Long userId) {
        this.userId = userId;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {
        return builder.equal(root.get("id").get("userId") ,this.userId);
    }
}
