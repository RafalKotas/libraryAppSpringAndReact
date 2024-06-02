package com.example.library.runners;

import com.example.library.services.BookBorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

//@Component
//@Order(4)
public class TestRunner implements CommandLineRunner {

    @Autowired
    BookBorrowingService bookBorrowingService;

    @Override
    public void run(String... args) {
        double meanDelayOfReturnSimpleBook = bookBorrowingService.meanDaysOfReturnDelaySingleBook(2L, 40);
        System.out.println(meanDelayOfReturnSimpleBook);

        double meanDelayOfReturnAllBooks = bookBorrowingService.meanDaysOfReturnDelayAllBooks(2L);
        System.out.println(meanDelayOfReturnAllBooks);

        double meanDaysOfSingleBookPossession = bookBorrowingService.meanDaysOfSingleBookPossession(2L, 44);
        System.out.println(meanDaysOfSingleBookPossession);

        double meanDaysOfBooksPossession = bookBorrowingService.meanDaysOfAllBooksPossession(2L);
        System.out.println(meanDaysOfBooksPossession);

        int maxDaysOfPossession = bookBorrowingService.maxDaysOfPossessionAllBooks(2L);
        System.out.println(maxDaysOfPossession);

        int maxDaysOfReturnDelay = bookBorrowingService.maxDaysOfReturnDelayAllBooks(2L);
        System.out.println(maxDaysOfReturnDelay);
    }
}
