package com.example.demo.Ladok;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/ladok")
public class Ladok {
    private final JdbcTemplate jdbcTemplate;

    public Ladok(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/courses/codeswithmodules")
    public ResponseEntity<?> getAllCourse() {
        try {


            List<String> courseCodes = jdbcTemplate.queryForList(
                    "SELECT course_code FROM LADOK_courses", String.class
            );

            if (courseCodes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kan inte hitta några kurser");
            }

            NamedParameterJdbcTemplate namedJdbc = new NamedParameterJdbcTemplate(jdbcTemplate);

            List<Map<String, Object>> courseModules = namedJdbc.queryForList(
                    "SELECT course_code, module_code FROM EPOK_modules WHERE course_code IN (:course_codes) ",
                    Map.of("course_codes", courseCodes)
            );

            Map<String, List<String>> courseCodesWithModules = new HashMap<>();
            for (Map<String, Object> row : courseModules) {
                String courseCode = (String) row.get("course_code");
                String courseModule = (String) row.get("module_code");

                if (!courseCodesWithModules.containsKey(courseCode)) {
                    courseCodesWithModules.put(courseCode, new ArrayList<>());
                }
                courseCodesWithModules.get(courseCode).add(courseModule);
            }


            courseCodes.forEach(System.out::println);
            return ResponseEntity.ok(courseCodesWithModules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ett fel uppstod: " + e.getMessage());
        }
    }
}
