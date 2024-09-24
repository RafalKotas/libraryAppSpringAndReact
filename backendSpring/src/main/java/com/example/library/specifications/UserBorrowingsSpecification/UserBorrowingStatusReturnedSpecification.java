package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

@AllArgsConstructor
public class UserBorrowingStatusReturnedSpecification implements Specification<BookBorrowing> {
    private final Long userId;
    private final Date requestDateMin;
    private final Date requestDateMax;
    private final Date borrowingDateMin;
    private final Date borrowingDateMax;
    private final Date returnDateMin;
    private final Date returnDateMax;

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

