package com.example.library.model.RequestBodyObjects;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DateBoundaryValues {

    private String requestDateMinValue;
    private String requestDateMaxValue;
    private String borrowingDateMinValue;
    private String borrowingDateMaxValue;
    private String returnDateMinValue;
    private String returnDateMaxValue;

    @Override
    public String toString() {
        return "DateBoundaryValues{" +
                "requestDateMinValue='" + requestDateMinValue + '\'' +
                ", requestDateMaxValue='" + requestDateMaxValue + '\'' +
                ", borrowingDateMinValue='" + borrowingDateMinValue + '\'' +
                ", borrowingDateMaxValue='" + borrowingDateMaxValue + '\'' +
                ", returnDateMinValue='" + returnDateMinValue + '\'' +
                ", returnDateMaxValue='" + returnDateMaxValue + '\'' +
                '}';
    }
}
