package com.example.library.controllers;

import com.example.library.model.BookBorrowing;
import com.example.library.model.User;
import com.example.library.model.UserToken.UserToken;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.UserRepository;
import com.example.library.repository.UserTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    BookBorrowingRepository bookBorrowingRepository;
    @Autowired
    UserTokenRepository userTokenRepository;

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/reader/{userId}")
    @PreAuthorize("hasRole('READER') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> readerAccess(@PathVariable("userId") Long userId) {
        Optional<User> reader = userRepository.findById(userId);

        System.out.println("Checking access to ReaderPanel...");

        if(reader.isPresent()) {

            Optional<UserToken> possibleActiveToken = userTokenRepository.activeTokenWithGivenUserId(reader.get().getId());

            if(possibleActiveToken.isPresent()) {
                List<BookBorrowing> readerBorrowings = bookBorrowingRepository.findByUser(reader.get());

                if(readerBorrowings.size() > 0) {
                    return new ResponseEntity<>(readerBorrowings, HttpStatus.OK);
                } else {
                    System.out.println("No borrowings at the moment.");
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/librarian")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<?> librarianAccess() {
        List<User> allUsers = userRepository.findAll();

        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }
}
