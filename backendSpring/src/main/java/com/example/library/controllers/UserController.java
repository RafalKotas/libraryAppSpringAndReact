package com.example.library.controllers;

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

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserTokenRepository userTokenRepository;

    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    @CrossOrigin
    @Transactional
    @DeleteMapping("/userManipulation/removeUserToken/{userId}")
    public ResponseEntity<Map<String, Object>> removeUserToken(@PathVariable("userId") Long userId) {
        Optional<UserToken> tokenWithUserId = userTokenRepository.activeTokenWithGivenUserId(userId);

        System.out.println(tokenWithUserId.isPresent());
        System.out.println("userId: " + userId);
        Map<String, Object> response = new HashMap<>();

        if(tokenWithUserId.isPresent()) {
            response.put("tokenExists", "yes");
            userTokenRepository.deleteByIdUserId(userId);
            if(!bookBorrowingRepository.findByIdUserId(userId).isEmpty()) {
                bookBorrowingRepository.deleteByIdUserId(userId);
                response.put("userBorrowingsDeleted", "yes");
                if(userRepository.findById(userId).isPresent()) {
                    userRepository.deleteById(userId);
                    response.put("userDeleted", "yes");
                }
            }
            response.put("tokenDeleted", "yes");
        } else {
            response.put("tokenExists", "no");
            response.put("tokenDeleted", "no");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @CrossOrigin
    @Transactional
    @DeleteMapping("/userManipulation/removeTokenOnLogout/{userId}")
    public ResponseEntity<Map<String, Object>> removeTokenOnLogout(@PathVariable("userId") Long userId) {
        Optional<UserToken> tokenWithUserId = userTokenRepository.activeTokenWithGivenUserId(userId);

        Map<String, Object> response = new HashMap<>();

        if(tokenWithUserId.isPresent()) {
            response.put("tokenExists", "yes");
            userTokenRepository.deleteByIdUserId(userId);
            response.put("tokenDeleted", "yes");
        } else {
            response.put("tokenExists", "no");
            response.put("tokenDeleted", "no");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/existByEmail/{userEmail}")
    public Boolean getUserByEmail(@PathVariable("userEmail") String userEmail) {
        return userRepository.existsByEmail(userEmail) ? true : false;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable("userId") Long userId) {
        Optional<User> userData = userRepository.findById(userId);

        if (userData.isPresent()) {
            return new ResponseEntity<>(userData.get(), HttpStatus.OK);
        } else {
            try {
                return new ResponseEntity<>(userData.get(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }
}
