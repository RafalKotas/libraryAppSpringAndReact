package com.example.library.controllers;

import java.util.*;
import java.util.stream.Collectors;

import com.example.library.model.ERole;
import com.example.library.model.Role;
import com.example.library.model.User;
import com.example.library.payload.request.LoginRequest;
import com.example.library.payload.request.SignupRequest;
import com.example.library.payload.response.JwtResponse;
import com.example.library.payload.response.MessageResponse;
import com.example.library.repository.RoleRepository;
import com.example.library.repository.UserRepository;
import com.example.library.security.jwt.JwtUtils;
import com.example.library.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Value("${rafalk.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        //here -> AuthEntryPoint if wrong password

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        System.out.println(jwt);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {

        System.out.println(signupRequest);
        System.out.println(signupRequest.getUsername());
        System.out.println(userRepository.existsByUsername(signupRequest.getUsername()));

        if(userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if(userRepository.existsByEmail(signupRequest.getEmail())) {
            System.out.println("Email is already in use");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use"));
        }

        // Create new user's account
        User user = new User(signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()),
                signupRequest.getFirstName(),
                signupRequest.getLastName());

        String RequestRole = signupRequest.getRole();

        Set<Role> roles = new HashSet<>();

        System.out.println("RequestRole: " + RequestRole);

        if (RequestRole == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_READER)
                    .orElseThrow( () -> new RuntimeException("Error: Role is not found.") );
            roles.add(userRole);
        } else {
            if (RequestRole.equalsIgnoreCase("librarian")) {
                Role librarianRole = roleRepository.findByName(ERole.ROLE_LIBRARIAN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(librarianRole);
            } else {
                Role readerRole = roleRepository.findByName(ERole.ROLE_READER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(readerRole);
            }
        }

        user.setRoles(roles);

        System.out.println(user);

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
