package com.example.demo.Ladok;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/ladok")
public class Ladok {
    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    public Ladok(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ger alla kurskoder med deras moduler ex [{"d0019n": ["5","6"].....
    @GetMapping("/courses/allcoursecodeswithModules")
    public ResponseEntity<?> getAllCourseCodes() {
        try {
            List<String> courseCodes = jdbcTemplate.queryForList(
                    "SELECT course_code FROM LADOK_courses", String.class
            );

            if (courseCodes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kan inte hitta några kurser");
            }

            RestTemplate restTemplate = new RestTemplate();
            Map<String, List<String>> result = new HashMap<>();

            for (String courseCode : courseCodes) {
                try {
                    ResponseEntity<List> response = restTemplate.getForEntity(
                            "http://localhost:8080/epok/course/allmodules?ladok_courseCode={code}",
                            List.class,
                            courseCode
                    );

                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        result.put(courseCode, response.getBody());
                    } else {
                        result.put(courseCode, Collections.emptyList());
                    }
                } catch (Exception e) {
                    // Om något går fel med EPOK, sätt tom lista
                    result.put(courseCode, Collections.emptyList());
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ett fel uppstod: " + e.getMessage());
        }
    }
    @GetMapping("/courses/coursedatafrommodule")
    public ResponseEntity<?> getCourseData(@RequestParam String courseCode, @RequestParam String module_code) {

        try {
            String url = "http://localhost:8080/epok/moduledata?courseCode={courseCode}&module_code={module_code}";

            Map<String, String> params = Map.of("courseCode", courseCode);

            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class, params);

            if(response.getBody().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kan inte hitta några kurser");
            }

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid anrop till EPOK: " + e.getMessage());
        }
    }
    @PatchMapping("/courses/gradeModules")
    public ResponseEntity<?> patchGradeModules(
        @RequestParam int student_courses_id,
        @RequestParam String module_Code,
        @RequestParam String grade,
        @RequestParam String date,
        @RequestParam String status
    ){
        try {
            String sql = "UPDATE LADOK_results SET grade=?,date=?, status=? WHERE student_course_id=? AND module_code = ? ";
            int numOfUpdateRows = jdbcTemplate.update(sql, student_courses_id, module_Code, grade, date, status);

            if(numOfUpdateRows == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("404,Inga resultat hittades en eller flera studenter/modul kunde inte hittas ");
            }

            return  ResponseEntity.ok().body("Betyg registrerat");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid registeringen: " + e.getMessage());
        }
    }
}
