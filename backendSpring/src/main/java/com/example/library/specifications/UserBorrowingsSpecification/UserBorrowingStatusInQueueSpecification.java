package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

public class UserBorrowingStatusInQueueSpecification implements Specification<BookBorrowing> {
    private final Long userId;
    private final Date requestDateMin;
    private final Date requestDateMax;

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