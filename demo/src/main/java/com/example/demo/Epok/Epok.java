package com.example.demo.Epok;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/epok")
public class Epok {

    @GetMapping("/allcourses")
    public List<String> getAllCourse() {
        return Arrays.asList("test", "Bober");
    }
}
