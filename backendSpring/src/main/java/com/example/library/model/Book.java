package com.example.library.model;

import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;
import javax.persistence.*;
import javax.persistence.metamodel.StaticMetamodel;

@Entity
@Table(name = "books")
@StaticMetamodel(Book.class)
@ToString
@NoArgsConstructor
@Setter
public class Book {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "book")
    Set<BookBorrowing> borrowings;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "yearPublished")
    private Integer yearPublished;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "genre")
    private String genre;

    public Book(String title, String author, Integer yearPublished, String description, String genre) {
        this.title = title;
        this.author = author;
        this.yearPublished = yearPublished;
        this.description = description;
        this.genre = genre;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getYearPublished() {
        return yearPublished;
    }

    public String getDescription() {
        return description;
    }
    public String getGenre() {
        return genre;
    }
}
