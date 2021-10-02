package com.example.library.payload.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class UserInQueueRowData {
    public Date requestDate;
    public String firstName;
    public String lastName;

    public int actualBorrowings;
    public int actualRequests;

    public double meanDaysOfAllBooksPossession;
    public double meanDaysOfReturnDelayAllBooks;
    public int maxDaysOfPossessionAllBooks;
    public int maxDaysOfReturnDelayAllBooks;

    public double meanDaysOfReturnDelaySingleBook;
    public double meanDaysOfSingleBookPossession;
    public int maxDaysOfSingleBookPossession;
    public int maxDaysOfSingleBookReturnDelay;

    public UserInQueueRowData(String firstName, String lastName, Date requestDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.requestDate = requestDate;
    }
}
