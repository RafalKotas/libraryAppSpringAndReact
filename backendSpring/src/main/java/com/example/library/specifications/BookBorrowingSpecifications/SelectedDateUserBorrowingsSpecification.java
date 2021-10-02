package com.example.library.specifications.BookBorrowingSpecifications;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class SelectedDateUserBorrowingsSpecification implements Specification<BookBorrowing> {
    private NotNullBorrowingsDatesSpecification notNullBorrowingsDatesSpecification;
    private UserBorrowingsSpecification userBorrowingsSpecification;

    public SelectedDateUserBorrowingsSpecification(String dateType, Long userId) {
        this.notNullBorrowingsDatesSpecification = new NotNullBorrowingsDatesSpecification(dateType);
        this.userBorrowingsSpecification = new UserBorrowingsSpecification(userId);
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {
        return builder.and(
                notNullBorrowingsDatesSpecification.toPredicate(root, query, builder),
                userBorrowingsSpecification.toPredicate(root, query, builder)
        );
    }
}
