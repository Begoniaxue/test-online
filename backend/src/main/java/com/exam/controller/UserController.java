package com.exam.controller;

import com.exam.common.Result;
import com.exam.dto.LoginDTO;
import com.exam.entity.User;
import com.exam.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Result<User> login(@RequestBody LoginDTO dto) {
        User user = userService.login(dto.getUsername(), dto.getPassword());
        if (user == null) {
            return Result.error("用户名或密码错误");
        }
        user.setPassword(null);
        return Result.success(user);
    }

    @GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }
}
