package com.example.library.runners;

import java.util.*;
import java.util.stream.Collectors;

import com.example.library.model.Book;
import com.example.library.model.BookBorrowing;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.BookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.model.User;

import com.example.library.services.BookBorrowingService;
import com.example.library.services.BookService;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(3)
@Slf4j
public class BorrowingSimulator implements CommandLineRunner {

    private final int BORROWING_IN_APP_REQUIRED = 300;

    private final int MAX_AVAILABLE_BOOK_ON_HANDS = 3;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    @Autowired
    BookBorrowingService bookBorrowingService;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    BookService bookService;



    private final DateTime startDate = new DateTime("2020-10-01T12:00:00");
    private final DateTime endDate = new DateTime("2021-01-01T12:00:00");

    private List<Long> userIds;
    private Long randomUserId;
    private Optional<User> randomUser;
    private int randomBookId;
    private Optional<Book> randomBook;

    private int borrowingsNo = 0;

    // books for borrow
    List<Integer> freeBooksIds;
    List<Integer> freeBooksIdsWithUserRequest;
    List<Integer> freeBooksIdsWithoutUserRequest;

    // books for which the user can subscribe to the queue
    List<Integer> booksIdsForWhichTheUserCanSubscribeToTheQueue;

    // books for return
    List<Integer> booksToReturnIds;

    List<String> possibleActions;

    BookBorrowing tmpBookBorrowing = null;

    int sumOfAvailableDecisions;
    int randomDecisionIndexChoosen;

    private List<Long> generateUsersIds() {
        List<User> allUsers = this.userRepository.findAll();

        return allUsers.stream().map(User::getId).collect(Collectors.toList());
    }

    private void setRandomUserNumber() {
        int indexInArr = getRandomNumber(0, this.userIds.size());
        this.randomUserId = this.userIds.get(indexInArr);
    }

    private int getRandomNumber(int min, int max) {
        Random random = new Random();
        return random.nextInt(max - min) + min;
    }

    private void generatePossibleActions() {
        this.possibleActions = new ArrayList<>();

        List<BookBorrowing> userBooksOnHands = this.bookBorrowingRepository.userActualBorrowings(this.randomUserId);

        //0 - borrow
        if(userBooksOnHands.size() < MAX_AVAILABLE_BOOK_ON_HANDS && !this.bookRepository.getAllAvailableWithoutParams().isEmpty()) {

            this.generateFreeBooksIds();
            if(!this.freeBooksIds.isEmpty()) {
                this.possibleActions.add("BORROW");
            }
        }

        //1 - return
        if(!userBooksOnHands.isEmpty()) {
            this.generateBooksToReturnIds();
            this.possibleActions.add("RETURN");
        }

        //2 - sign in for a queue
        //generate Book for which user can sign in for a queue
        this.generateBooksIdsForWhichTheUserCanSubscribeToTheQueue();
        if(!this.booksIdsForWhichTheUserCanSubscribeToTheQueue.isEmpty()) {
            this.possibleActions.add("SUBSCRIBE TO THE QUEUE");
        }

        //3 - skip - no action
        this.possibleActions.add("SKIP");
    }

    private void generateFreeBooksIds() {
        List<Book> freeBooks = this.bookRepository.getAllAvailableWithoutParams();
        this.freeBooksIds = freeBooks.stream().map(Book::getId).collect(Collectors.toList());
    }

    private void generateBooksIdsInUserQueuesThatAreFree() {
        List<Book> allBooks = this.bookRepository.findAll();
        this.freeBooksIdsWithUserRequest = new ArrayList<>();

        for(Book book: allBooks) {
            int bookId = book.getId();
            boolean isUserInBookQueue = bookBorrowingService.isUserInBookQueue(this.randomUserId, bookId);

            if(isUserInBookQueue && bookService.bookFree(bookId)) {
                this.freeBooksIdsWithUserRequest.add(bookId);
            }
        }
    }

    private void generateBooksIdsNotInUserQueuesThatAreFree() {
        List<Book> allBooks = this.bookRepository.findAll();
        this.freeBooksIdsWithoutUserRequest = new ArrayList<>();

        for(Book book: allBooks) {
            int bookId = book.getId();
            boolean isUserNotInBookQueue = !bookBorrowingService.isUserInBookQueue(this.randomUserId, bookId);

            if(isUserNotInBookQueue && bookService.bookFree(bookId)) {
                freeBooksIdsWithoutUserRequest.add(bookId);
            }
        }
    }

    private void generateBooksToReturnIds() {
        List<BookBorrowing> userActualBorrowings = this.bookBorrowingRepository.userActualBorrowings(this.randomUserId);
        List<Book> booksToReturn = userActualBorrowings.stream().map(BookBorrowing::getBook).collect(Collectors.toList());

        this.booksToReturnIds = new ArrayList<>();

        this.booksToReturnIds = booksToReturn.stream().map(Book::getId).collect(Collectors.toList());
    }

    private void generateBooksIdsForWhichTheUserCanSubscribeToTheQueue() {
        List<Book> allBooksFromLibrary = bookRepository.findAll();
        this.booksIdsForWhichTheUserCanSubscribeToTheQueue = new ArrayList<>();
        for(Book book : allBooksFromLibrary) {
            if(userCanSubscribeToTheBookQueue(book.getId())) {
                this.booksIdsForWhichTheUserCanSubscribeToTheQueue.add(book.getId());
            }
        }
    }

    private boolean userCanSubscribeToTheBookQueue(int bookId) {
        boolean bookFree = this.bookService.bookFree(bookId);
        boolean hasUserBookWithId = this.bookService.hasUserBookWithId(this.randomUserId, bookId);
        boolean userInBookQueue =  this.bookBorrowingService.isUserInBookQueue(this.randomUserId, bookId);
        boolean maxBooksReached = this.bookBorrowingService.maximumBooksOnHandsReached(this.randomUserId);
        return (!bookFree && !hasUserBookWithId && !userInBookQueue)
        || (bookFree && maxBooksReached && !userInBookQueue);
    }

    private void setUserAndBook() {
        this.randomBook = bookRepository.findById(randomBookId);
        this.randomUser = userRepository.findById(randomUserId);
    }

    @Transactional
    public void mainSection(DateTime activeDate) {
        int optionNumber = this.getRandomNumber(0, this.possibleActions.size());

        boolean print_info = true;

        switch (this.possibleActions.get(optionNumber)) {
            case ("BORROW"):
                borrowingsNo++;
                tmpBookBorrowing = null;
                // simulate situation when librarian gives book to user (user is in book queue)
                this.generateBooksIdsInUserQueuesThatAreFree();
                // books free, user take the book himself, (user is not in book queue)
                this.generateBooksIdsNotInUserQueuesThatAreFree();
                this.sumOfAvailableDecisions =
                        freeBooksIdsWithoutUserRequest.size() + freeBooksIdsWithUserRequest.size();
                this.randomDecisionIndexChoosen = getRandomNumber(0, this.sumOfAvailableDecisions);

                // simple borrow
                if(this.randomDecisionIndexChoosen < freeBooksIdsWithoutUserRequest.size()) {
                    this.randomBookId = this.freeBooksIdsWithoutUserRequest.get( this.randomDecisionIndexChoosen );
                    this.setUserAndBook();

                    if(this.randomUser.isPresent() && this.randomBook.isPresent()) {
                        if (print_info) {
                            log.info("({}) Book no {} taken by user no {} on {}", borrowingsNo, this.randomBookId, this.randomUserId, activeDate);
                        }
                        bookBorrowingRepository.save(new BookBorrowing(this.randomUser.get(), this.randomBook.get(), activeDate.toDate(), activeDate.toDate()));
                    }

                }
                // give book simulation
                else {
                    this.randomBookId = this.freeBooksIdsWithUserRequest
                            .get(this.randomDecisionIndexChoosen - freeBooksIdsWithoutUserRequest.size());
                    this.setUserAndBook();

                    Optional<BookBorrowing> userRequestWithBookToGive = bookBorrowingRepository
                            .potentialBookToGiveUser(randomBookId, randomUserId);

                    if(userRequestWithBookToGive.isPresent()) {
                        BookBorrowing requestWithBookToGive = userRequestWithBookToGive
                                .get();
                        requestWithBookToGive.setBorrowingDate(activeDate.toDate());
                        bookBorrowingRepository.save(requestWithBookToGive);
                        if (print_info) {
                            log.info("({}) Book no {} given to user no {} on {} (in queue before)", borrowingsNo, borrowingsNo, this.randomBookId, this.randomUserId, activeDate);
                        }
                    }
                }
                break;
            case ("RETURN"):
                this.generateBooksToReturnIds();
                this.randomDecisionIndexChoosen = getRandomNumber(0, this.booksToReturnIds.size());
                this.randomBookId = this.booksToReturnIds.get( this.randomDecisionIndexChoosen );
                this.setUserAndBook();

                Optional<BookBorrowing> borrowingWithReturningBook = this.bookBorrowingRepository.
                        findByIdBookIdAndIdUserIdAndReturnDate(this.randomBookId, this.randomUserId,null);

                if(borrowingWithReturningBook.isPresent()) {
                    borrowingWithReturningBook.get().setReturnDate(activeDate.toDate());
                    this.bookBorrowingRepository.save(borrowingWithReturningBook.get());
                    if (print_info) {
                        log.info("({}) User no {} returned book no {} on {}", borrowingsNo, this.randomUserId, this.randomBookId, activeDate);
                    }
                }
                break;
            case ("SUBSCRIBE TO THE QUEUE"):
                this.generateBooksIdsForWhichTheUserCanSubscribeToTheQueue();
                this.randomDecisionIndexChoosen = getRandomNumber(0,
                        this.booksIdsForWhichTheUserCanSubscribeToTheQueue.size());
                this.randomBookId = this.booksIdsForWhichTheUserCanSubscribeToTheQueue.get( this.randomDecisionIndexChoosen );
                this.setUserAndBook();

                this.bookBorrowingRepository.save(
                        new BookBorrowing(randomUser.get(), randomBook.get(), activeDate.toDate(), null));
                if (print_info) {
                    log.info("({}) User no {} subscribed for queue book no {} on {}", borrowingsNo, this.randomUserId, this.randomBookId, activeDate);
                }
                break;
            case ("SKIP"):
                if (print_info) {
                    log.info("({}) User no {} , move skipped on {}", borrowingsNo, this.randomUserId, activeDate);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void run(String... args) {
        //

        int borrowingCount = bookBorrowingRepository.allBorrowingsCount();

        if(borrowingCount < BORROWING_IN_APP_REQUIRED) {
            // 1.Simulation Period (startDate and endDate) yyyy-mm-ddThh:mm:ss
            DateTime activeDate = startDate;

            this.userIds = this.generateUsersIds();

            while(activeDate.isBefore(endDate)) {
                this.setRandomUserNumber();
                this.generatePossibleActions();

                this.mainSection(activeDate);
                activeDate = activeDate.plusDays(1);
            }
        } else {
            System.out.println("Borrowings Generated earlier (more than " + BORROWING_IN_APP_REQUIRED + ") .");
        }
    }
}
