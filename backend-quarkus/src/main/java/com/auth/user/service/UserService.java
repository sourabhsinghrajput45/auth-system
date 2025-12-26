package com.auth.user.service;

import com.auth.user.entity.User;
import com.auth.user.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Optional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    /**
     * Create a new user account.
     * NOTE: Password must already be hashed before calling this method.
     */
    @Transactional
    public User createUser(String email, String plainPassword) {

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new IllegalStateException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(
                com.auth.security.PasswordHasher.hash(plainPassword)
        );
        user.setEmailVerified(false);

        userRepository.persist(user);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void markEmailAsVerified(User user) {
        user.setEmailVerified(true);
        userRepository.update(user);
    }
}
