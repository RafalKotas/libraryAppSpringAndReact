package com.example.library.specifications.UserBorrowingsSpecification;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

public class UserBorrowingsStatusAllSpecification implements Specification<BookBorrowing> {
    private UserBorrowingStatusInQueueSpecification userBorrowingStatusInQueueSpecification;
    private UserBorrowingStatusOnHandsSpecification userBorrowingStatusOnHandsSpecification;
    private UserBorrowingStatusReturnedSpecification userBorrowingStatusReturnedSpecification;

    public UserBorrowingsStatusAllSpecification(Long userId, Date requestDateMin, Date requestDateMax
            , Date borrowingDateMin, Date borrowingDateMax, Date returnDateMin, Date returnDateMax) {
        this.userBorrowingStatusInQueueSpecification = new UserBorrowingStatusInQueueSpecification(userId, requestDateMin, requestDateMax);
        this.userBorrowingStatusOnHandsSpecification = new UserBorrowingStatusOnHandsSpecification(userId, requestDateMin, requestDateMax,
                borrowingDateMin, borrowingDateMax);
        this.userBorrowingStatusReturnedSpecification = new UserBorrowingStatusReturnedSpecification(userId, requestDateMin, requestDateMax,
                borrowingDateMin, borrowingDateMax, returnDateMin, returnDateMax);
    }

    public UserBorrowingsStatusAllSpecification(UserBorrowingStatusInQueueSpecification userBorrowingStatusInQueueSpecification,
                                                UserBorrowingStatusOnHandsSpecification userBorrowingStatusOnHandsSpecification,
                                                UserBorrowingStatusReturnedSpecification userBorrowingStatusReturnedSpecification) {
        this.userBorrowingStatusInQueueSpecification = userBorrowingStatusInQueueSpecification;
        this.userBorrowingStatusOnHandsSpecification = userBorrowingStatusOnHandsSpecification;
        this.userBorrowingStatusReturnedSpecification = userBorrowingStatusReturnedSpecification;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {

        return builder.or(
                userBorrowingStatusInQueueSpecification.toPredicate(root, query, builder),
                userBorrowingStatusOnHandsSpecification.toPredicate(root, query, builder),
                userBorrowingStatusReturnedSpecification.toPredicate(root, query, builder)
        );
    }
}
