package com.example.library.repository;

import com.example.library.model.UserToken.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserToken, Long>, JpaSpecificationExecutor<UserToken> {
    // find if book with given id is borrowed
    @Query(value = "SELECT *" +
            " FROM user_tokens" +
            " WHERE user_id = :userId and active = true",
            nativeQuery = true)
    Optional<UserToken> activeTokenWithGivenUserId(@Param("userId") Long userId);

    Long deleteByIdUserId(Long userId);
}
