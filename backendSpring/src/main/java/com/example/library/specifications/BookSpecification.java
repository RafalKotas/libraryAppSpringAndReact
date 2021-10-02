package com.example.library.specifications;

import com.example.library.model.Book;
import com.example.library.model.Book_;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BookSpecification implements Specification {
    private final Book book;

    public BookSpecification(Book book) {
        this.book = book;
    }

    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
        return criteriaBuilder.and(
                criteriaBuilder.like(root.get(Book_.TITLE), "%" + this.book.getTitle() + "%"),
                criteriaBuilder.like(root.get(Book_.AUTHOR), "%" + this.book.getAuthor() + "%"),
                criteriaBuilder.like(root.get(Book_.DESCRIPTION), "%" + this.book.getDescription() + "%"),
                criteriaBuilder.like(root.get(Book_.GENRE), "%" + this.book.getGenre() + "%")
        );
    }
}
