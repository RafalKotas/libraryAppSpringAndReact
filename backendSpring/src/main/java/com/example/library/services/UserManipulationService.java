package com.example.library.services;

import com.example.library.model.BookBorrowing;
import com.example.library.model.UserToken.UserToken;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.UserRepository;
import com.example.library.repository.UserTokenRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Setter
@Service
public class UserManipulationService {

    private Long userId;
    private Map<String, Object> response;

    @Autowired
    UserTokenRepository userTokenRepository;

    @Autowired
    BookBorrowingRepository bookBorrowingRepository;

    @Autowired
    UserRepository userRepository;

    public UserManipulationService initResponse() {
        response = new HashMap<>();
        return this;
    }

    public Map<String, Object> getResponse() {
        return response;
    }

    public UserManipulationService deleteUserToken() {
        Optional<UserToken> tokenWithUserId = userTokenRepository.activeTokenWithGivenUserId(userId);

        if(tokenWithUserId.isPresent()) {
            System.out.println("user Present");
            response.put("tokenExists", "yes");
            userTokenRepository.deleteByIdUserId(userId);
            response.put("tokenDeleted", "yes");

            //System.out.println(userBorrowings);

            /*System.out.println(bookBorrowingRepository.findByIdUserId(userId));
            if(!bookBorrowingRepository.findByIdUserId(userId).isEmpty()) {
                bookBorrowingRepository.deleteByIdUserId(userId);
                response.put("userBorrowingsDeleted", "yes");
                if(userRepository.findById(userId).isPresent()) {
                    userRepository.deleteById(userId);
                    response.put("userDeleted", "yes");
                }
            }*/
        } else {
            response.put("tokenExists", "no");
            response.put("tokenDeleted", "no");
        }

        return this;
    }
}
