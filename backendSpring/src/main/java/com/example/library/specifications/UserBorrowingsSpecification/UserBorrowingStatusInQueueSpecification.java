package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import com.example.library.specifications.BookBorrowingSpecifications.SelectedDateUserBorrowingsSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class UserBorrowingStatusInQueueSpecification implements Specification<BookBorrowing> {
    private Long userId;
    private Date requestDateMin;
    private Date requestDateMax;

    public UserBorrowingStatusInQueueSpecification(Long userId, Date requestDateMin, Date requestDateMax) {
        this.userId = userId;
        this.requestDateMin = requestDateMin;
        this.requestDateMax = requestDateMax;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {

        return builder.and(
                builder.between(root.get("id").get("requestDate"), requestDateMin, requestDateMax ),
                builder.isNull(root.get("borrowingDate")),
                builder.isNull(root.get("returnDate")),
                builder.equal( root.get("id").get("userId"), userId)
        );
    }
}