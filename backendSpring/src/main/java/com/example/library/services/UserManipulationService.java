package com.example.library.services;

import com.example.library.model.UserToken.UserToken;
import com.example.library.repository.BookBorrowingRepository;
import com.example.library.repository.UserRepository;
import com.example.library.repository.UserTokenRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Setter
@Service
public class UserManipulationService {

    private Long userId;

    @Getter
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

    public UserManipulationService deleteUserToken() {
        Optional<UserToken> tokenWithUserId = userTokenRepository.activeTokenWithGivenUserId(userId);

        if(tokenWithUserId.isPresent()) {
            System.out.println("user Present");
            response.put("tokenExists", "yes");
            userTokenRepository.deleteByIdUserId(userId);
            response.put("tokenDeleted", "yes");
        } else {
            response.put("tokenExists", "no");
            response.put("tokenDeleted", "no");
        }

        return this;
    }
}
