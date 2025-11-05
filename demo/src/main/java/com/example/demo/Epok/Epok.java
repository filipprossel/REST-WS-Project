package com.example.demo.Epok;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/epok")
public class Epok {

    private final JdbcTemplate jdbcTemplate;

    public Epok(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // Hämtar alla moduler till en kurs ex d0019n = [5,6]
    @GetMapping("/course/allmodules")
    public ResponseEntity<?> getModules(@RequestParam String ladok_courseCode) {
        try {
            String sql = "SELECT course_code FROM EPOK_courses WHERE course_code = ?";
            List<String> courseCode = jdbcTemplate.queryForList(sql, String.class, ladok_courseCode);

            // är kurskod valid
            if (courseCode.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Ingen kurskod hittades för: " + ladok_courseCode);
            }

            String moduleSQL = "SELECT module_id FROM EPOK_modules WHERE course_code = ?";
            List<String> modules = jdbcTemplate.queryForList(moduleSQL, String.class, ladok_courseCode);

            if (modules.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Inga moduler hittades för kursen: " + ladok_courseCode);
            }

            return ResponseEntity.ok(modules);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ett fel uppstod: " + e.getMessage());
        }
    }
}
