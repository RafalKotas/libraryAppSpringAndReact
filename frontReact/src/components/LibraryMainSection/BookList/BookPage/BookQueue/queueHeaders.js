export const headersWithoutInputs = [
    [
        {
            textValue: "Basic User Info",
            rowSpan: 1,
            colSpan: 5,
            appendSortLabel: false,
        },
        {
            textValue: "User Statistics (adjust weights)",
            rowSpan: 1,
            colSpan: 9,
            appendSortLabel: false,
        },
        {
            textValue: "Action",
            rowSpan: 4,
            colSpan: 1,
            appendSortLabel: false,
        }
    ],
    [
        {
            textValue: "First name",
            rowSpan: 3,
            colSpan: 1,
            appendSortLabel: false,
        },
        {
            textValue: "Last name",
            rowSpan: 3,
            colSpan: 1,
            appendSortLabel: false,
        },
        {
            textValue: "Request Date",
            rowSpan: 3,
            colSpan: 1,
            appendSortLabel: false,
        },
        {
            textValue: "Books on hands",
            rowSpan: 3,
            colSpan: 1,
            appendSortLabel: false,
        },
        {
            textValue: "Actual requests",
            rowSpan: 3,
            colSpan: 1,
            appendSortLabel: false,
        }
    ],
    [
        {
            textValue: "This book",
            rowSpan: 1,
            colSpan: 4,
            appendSortLabel: false,
        },
        {
            textValue: "All books",
            rowSpan: 1,
            colSpan: 4,
            appendSortLabel: false,
        },
        {
            textValue: "Score",
            rowSpan: 2,
            colSpan: 1,
            appendSortLabel: true,
        }
    ]
]

export const statNamesAndAbbreviations = {
    "meanDaysOfReturnDelaySingleBook": "meanPos",
    "meanDaysOfSingleBookPossession": "meanRet",
    "maxDaysOfSingleBookPossession": "maxPos",
    "maxDaysOfSingleBookReturnDelay": "maxRet",
    "meanDaysOfAllBooksPossession": "meanPos",
    "meanDaysOfReturnDelayAllBooks": "meanRet",
    "maxDaysOfPossessionAllBooks": "maxPos",
    "maxDaysOfReturnDelayAllBooks": "maxRet"
}

export const headersWithInputs = {
    statisticSingleBookHeaders : {
        "meanDaysOfReturnDelaySingleBook": "meanPos",
        "meanDaysOfSingleBookPossession": "meanRet",
        "maxDaysOfSingleBookPossession": "maxPos",
        "maxDaysOfSingleBookReturnDelay": "maxRet"
    },
    statisticAllBooksHeaders : {
        "meanDaysOfAllBooksPossession": "meanPos",
        "meanDaysOfReturnDelayAllBooks": "meanRet",
        "maxDaysOfPossessionAllBooks": "maxPos",
        "maxDaysOfReturnDelayAllBooks": "maxRet"
    }
}

export const headersWithInputsReversed = {
    statisticSingleBookHeaders : {
        "meanPos": "meanDaysOfReturnDelaySingleBook",
        "meanRet": "meanDaysOfSingleBookPossession",
        "maxPos": "maxDaysOfSingleBookPossession",
        "maxRet": "maxDaysOfSingleBookReturnDelay",
    },
    statisticAllBooksHeaders : {
        "meanPos": "meanDaysOfAllBooksPossession",
        "meanRet": "meanDaysOfReturnDelayAllBooks",
        "maxPos": "maxDaysOfPossessionAllBooks",
        "maxRet": "maxDaysOfReturnDelayAllBooks"
    }
}