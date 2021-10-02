package com.example.library.repository;

import java.util.Optional;
import java.util.List;

import com.example.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


    List<User> findAll();

    Optional<User> findById(Long Id);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
