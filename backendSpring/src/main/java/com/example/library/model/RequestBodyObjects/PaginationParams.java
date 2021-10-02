package com.example.library.model.RequestBodyObjects;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaginationParams {
    private Integer pageSize;
    private Integer currentPage;
}
