package com.exam.service;

import com.exam.entity.User;
import com.exam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);
        return userOpt.orElse(null);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
