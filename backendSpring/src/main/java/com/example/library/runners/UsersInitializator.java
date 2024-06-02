package com.example.library.runners;

import com.example.library.model.ERole;
import com.example.library.model.Role;
import com.example.library.model.User;
import com.example.library.repository.RoleRepository;
import com.example.library.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Component
@Order(2)
public class UsersInitializator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UsersInitializator.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) {

        System.out.println("Users init(2)");

        if(!roleRepository.findByName(ERole.ROLE_READER).isPresent()) {
            Role reader = new Role(ERole.ROLE_READER);
            roleRepository.save(reader);
        }
        if(!roleRepository.findByName(ERole.ROLE_LIBRARIAN).isPresent()) {
            Role librarian = new Role(ERole.ROLE_LIBRARIAN);
            roleRepository.save(librarian);
        }

        Role roleReader = roleRepository.findByName(ERole.ROLE_READER)
                .orElseThrow( () -> new RuntimeException("Error: Role is not found.") );
        Role roleLibrarian = roleRepository.findByName(ERole.ROLE_LIBRARIAN)
                .orElseThrow( () -> new RuntimeException("Error: Role is not found.") );

        List<User> usersList = new ArrayList<>();
        Set<Role> roles = new HashSet<>();

        User user1 = new User("mekellfood",
                "2ellim@mekellfood.net",
                encoder.encode("DcHzyZ4Of3xT38aq"),
                "Kiersten",
                "Moyer");
        roles.add(roleReader);
        user1.setRoles(roles);
        usersList.add(user1);

        roles = new HashSet<>();
        User user2 = new User("huckerj",
                "8ma7moud.huckerj@bookik.site.net",
                encoder.encode("qSRXoCnR85TglGdF"),
                "Marcelo",
                "Dillon");
        roles.add(roleReader);
        user2.setRoles(roles);
        usersList.add(user2);

        roles = new HashSet<>();
        User user3 = new User("xavierwalton",
                "xw_el45r@4liberalarts.com",
                encoder.encode("qSRXoCnR85TglGdF"),
                "Tucker",
                "Cox");
        roles.add(roleReader);
        user3.setRoles(roles);
        usersList.add(user3);

        roles = new HashSet<>();
        User user4 = new User("guenna4",
                "xguenna4@dtecet.com",
                encoder.encode("hjE0LEhFe0x9BZxK"),
                "Lorelei",
                "Schwartz");
        roles.add(roleLibrarian);
        user4.setRoles(roles);
        usersList.add(user4);

        //2PruOD0IIxP0XqVs
        roles = new HashSet<>();
        User user5 = new User("karim_gr",
                "9karim_gr@zipso.site",
                encoder.encode("2PruOD0IIxP0XqVs"),
                "Lorena",
                "Fry");
        roles.add(roleLibrarian);
        user5.setRoles(roles);
        usersList.add(user5);

        for (User singleUser : usersList){
            if(!userRepository.existsByEmail(singleUser.getEmail())) {
                userRepository.save(singleUser);
            }
        }

        //userRepository.deleteById(1L);
        //userRepository.deleteById(4L);
    }
}
