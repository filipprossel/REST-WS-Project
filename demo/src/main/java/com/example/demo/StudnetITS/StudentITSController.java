package com.example.demo.StudnetITS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/studentITS")
public class StudentITSController {
    @Autowired
    private StudentITSService studentITSService;

    //Hämta alla studenter med dessa SSN
    @GetMapping("/getStudents")
    public List<StudentITSStudent> getStudents(@RequestParam ArrayList<String> listSSN){
        return studentITSService.findStudentsBySSN(listSSN);
    }
}
