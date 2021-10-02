package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

public class UserBorrowingStatusOnHandsSpecification implements Specification<BookBorrowing> {
    private Long userId;
    private Date requestDateMin;
    private Date requestDateMax;
    private Date borrowingDateMin;
    private Date borrowingDateMax;

    public UserBorrowingStatusOnHandsSpecification(Long userId, Date requestDateMin, Date requestDateMax
    , Date borrowingDateMin, Date borrowingDateMax) {
        this.userId = userId;
        this.requestDateMin = requestDateMin;
        this.requestDateMax = requestDateMax;
        this.borrowingDateMin = borrowingDateMin;
        this.borrowingDateMax = borrowingDateMax;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {

        return builder.and(
                builder.between( root.get("borrowingDate"), borrowingDateMin, borrowingDateMax ),
                builder.isNotNull(root.get("id").get("requestDate")),
                builder.isNotNull(root.get("borrowingDate")),
                builder.isNull(root.get("returnDate")),
                builder.equal( root.get("id").get("userId"), userId),
                builder.between( root.get("id").get("requestDate"), requestDateMin, requestDateMax )/*,
                builder.between( root.get("borrowingDate"), borrowingDateMin, borrowingDateMax ),
                builder.isNull(root.get("returnDate"))
                builder.equal( root.get("id").get("userId"), userId),
                builder.isNull(root.get("returnDate")),
                builder.equal( root.get("id").get("userId"), userId)*/
        );
    }
}
