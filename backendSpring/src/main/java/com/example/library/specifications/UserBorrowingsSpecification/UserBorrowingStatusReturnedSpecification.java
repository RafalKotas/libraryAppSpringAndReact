package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

public class UserBorrowingStatusReturnedSpecification implements Specification<BookBorrowing> {
    private Long userId;
    private Date requestDateMin;
    private Date requestDateMax;
    private Date borrowingDateMin;
    private Date borrowingDateMax;
    private Date returnDateMin;
    private Date returnDateMax;

    public UserBorrowingStatusReturnedSpecification(Long userId, Date requestDateMin, Date requestDateMax
            , Date borrowingDateMin, Date borrowingDateMax, Date returnDateMin, Date returnDateMax) {
        this.userId = userId;
        this.requestDateMin = requestDateMin;
        this.requestDateMax = requestDateMax;
        this.borrowingDateMin = borrowingDateMin;
        this.borrowingDateMax = borrowingDateMax;
        this.returnDateMin = returnDateMin;
        this.returnDateMax = returnDateMax;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {

        return builder.and(
                builder.between( root.get("id").get("requestDate"), requestDateMin, requestDateMax ),
                builder.between( root.get("borrowingDate"), borrowingDateMin, borrowingDateMax ),
                builder.between( root.get("returnDate"), returnDateMin, returnDateMax ),
                builder.equal( root.get("id").get("userId"), userId)
        );
    }
}

