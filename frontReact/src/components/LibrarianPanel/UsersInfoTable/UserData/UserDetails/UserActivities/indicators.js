export function actualBorrowingsIndicator(booksOnHand) {
    let booksLength = booksOnHand.length

    let indicatorClass = "";

    switch (booksLength) {
        case 3:
            indicatorClass = "bg-danger"
            break;
        case 2:
            indicatorClass = "bg-warning text-dark"
            break;
        default:
            indicatorClass = "bg-info"
      }
    return <span className={"badge " + indicatorClass}>{booksLength}</span>
}

export function actualQueuesIndicator(queuesParticipated) {
    let queues = queuesParticipated.length;

    let indicatorClass = "";

    if(queues === 10) {
        indicatorClass = "bg-danger";
    } else if(queues > 7) {
        indicatorClass = "bg-warning";
    } else if (queues > 3) {
        indicatorClass = "bg-info";
    } else {
        indicatorClass ="bg-success";
    }

    return <span className={"badge " + indicatorClass}>{queues}</span>
}