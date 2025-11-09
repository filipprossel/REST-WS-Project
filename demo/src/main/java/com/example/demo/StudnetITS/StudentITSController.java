package com.example.demo.StudnetITS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/studentITS")



public class StudentITSController {
    @Autowired
    private StudentITSService studentITSService;




    private final JdbcTemplate jdbcTemplate;

    public StudentITSController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    //Hämta alla studenter med dessa SSN
    @GetMapping("/getStudents")
    public List<StudentITSStudent> getStudents(@RequestParam ArrayList<String> listSSN){
        return studentITSService.findStudentsBySSN(listSSN);
    }


    // hämtar all studentdata
    @GetMapping("/studentdatafromssn")
    public ResponseEntity<?> getStudentsFromSSN(@RequestParam List<String> listSSN) {
        if(listSSN.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingen data kunde hittas för vald kurs och modul");
        }

        String inSql = String.join(",", Collections.nCopies(listSSN.size(), "?"));
        String sql = "SELECT * FROM StudentsITS_students WHERE SSN IN (" + inSql + ")";

        List<Map<String, Object>> students = jdbcTemplate.queryForList(sql, listSSN.toArray());



        //        Map<String, Object> moduleData =  .queryForMap(sql, course_code, module_id);

        if (students.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingen data kunde hittas för vald kurs och modul");
        }

        return ResponseEntity.ok(students);
    }
}
