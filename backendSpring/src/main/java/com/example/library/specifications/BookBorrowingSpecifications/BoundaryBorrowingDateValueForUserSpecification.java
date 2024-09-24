package com.example.library.specifications.BookBorrowingSpecifications;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BoundaryBorrowingDateValueForUserSpecification implements Specification<BookBorrowing> {
    private final Long userId;
    private final String dateType;
    private final boolean latestDate;
    private final SelectedDateUserBorrowingsSpecification selectedDateUserBorrowingsSpecification;

    public BoundaryBorrowingDateValueForUserSpecification(String dateType, Long userId, boolean latest) {
        this.userId = userId;
        this.dateType = dateType;
        this.latestDate = latest;
        this.selectedDateUserBorrowingsSpecification = new SelectedDateUserBorrowingsSpecification(dateType, userId);
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {
        if(dateType.equals("requestDate"))
            if (this.latestDate)
                query.orderBy(builder.desc(root.get("id").get("requestDate")));
            else
                query.orderBy(builder.asc(root.get("id").get("requestDate")));
        else
            if (this.latestDate)
                query.orderBy(builder.desc(root.get(dateType)));
            else
                query.orderBy(builder.asc(root.get(dateType)));

        return builder.and(
                selectedDateUserBorrowingsSpecification.toPredicate(root, query, builder)
        );
    }
}
