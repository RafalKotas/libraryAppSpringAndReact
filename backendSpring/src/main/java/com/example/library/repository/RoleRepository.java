package com.example.library.repository;

import java.util.Optional;

import com.example.library.model.ERole;
import com.example.library.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
