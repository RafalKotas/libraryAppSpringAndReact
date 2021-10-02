package com.example.library.specifications.BookBorrowingSpecifications;

import com.example.library.model.BookBorrowing;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class NotNullBorrowingsDatesSpecification implements Specification<BookBorrowing> {

    private String dateColumn;

    public NotNullBorrowingsDatesSpecification(String dateType) {
        this.dateColumn = dateType;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder builder) {
        return this.dateColumn.equals("requestDate")
                ? builder.isNotNull(root.get("id").get("requestDate"))
                :  builder.isNotNull(root.get(this.dateColumn));
    }
}