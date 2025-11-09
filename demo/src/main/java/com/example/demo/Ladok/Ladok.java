package com.example.demo.Ladok;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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

    // hämtar all data från EPOK & ITSstudent för en vald kurs och kursmodul
    @GetMapping("/courses/coursedatafrommodule")
    public ResponseEntity<?> getCourseData(@RequestParam String courseCode, @RequestParam String module_id) {

        Map<String, Object> courseDataFromModule = new HashMap<>();

        System.out.println(courseCode + " " + module_id);

        try {
            // --- Hämta moduldata från EPOK ---
            String urlEpok = "http://localhost:8080/epok/course/moduledataforcourse?course_code={course_code}&module_id={module_id}";

            Map<String, String> params = Map.of(
                    "course_code", courseCode,
                    "module_id", module_id
            );

            ResponseEntity<Map<String, Object>> responseEpok =
                    restTemplate.exchange(
                            urlEpok,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<Map<String, Object>>() {
                            },
                            params
                    );

            if (!responseEpok.getStatusCode().is2xxSuccessful() || responseEpok.getBody() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kan inte hitta kursdata i EPOK");
            }

            // Lägg till objektet direkt i hashmapen
            courseDataFromModule.put("epok", responseEpok.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid anrop till EPOK: " + e.getMessage());
        }

        try {
            // --- Hämta SSN från LADOK ---
            List<String> listSSNInCourse = jdbcTemplate.queryForList(
                    "SELECT SSN FROM LADOK_student_courses WHERE course_code = ? AND module_id=",
                    String.class,
                    courseCode
            );

            if (listSSNInCourse.isEmpty()) {
                courseDataFromModule.put("studentITS", Collections.emptyList());
                return ResponseEntity.ok(courseDataFromModule);
            }

            // --- Bygg URL för studentITS-anrop ---
            String urlITS = "http://localhost:8080/studentITS/getStudents";

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlITS);
            for (String ssn : listSSNInCourse) {
                builder.queryParam("listSSN", ssn);
            }

            // --- Hämta lista av studenter ---
            ResponseEntity<List<Map<String, Object>>> responseStudentsITS =
                    restTemplate.exchange(
                            builder.toUriString(),
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<Map<String, Object>>>() {
                            }
                    );

            if (!responseStudentsITS.getStatusCode().is2xxSuccessful() || responseStudentsITS.getBody() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hittade inga studenter i ITS");
            }

            courseDataFromModule.put("studentITS", responseStudentsITS.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid anrop till ITSStudents: " + e.getMessage());
        }

        return ResponseEntity.ok(courseDataFromModule);
    }

    public static class GradeModuleDTO {
        public int student_courses_id;
        public String module_Code;
        public String grade;
        public String date;
        public String status;
    }

    @PostMapping("/courses/grademodule")
    public ResponseEntity<?> patchGradeModules(@RequestBody List<GradeModuleDTO> gradeModules) {
        try {
            String sql = "UPDATE LADOK_results SET grade=?, date=?, status=? WHERE student_courses_id=? AND module_code=?";

            int updatedCount = 0;

            for (GradeModuleDTO gm : gradeModules) {
                int numOfUpdateRows = jdbcTemplate.update(sql, gm.grade, gm.date, gm.status, gm.student_courses_id, gm.module_Code);
                updatedCount += numOfUpdateRows;
            }

            if (updatedCount == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("404: Inga resultat hittades. En eller flera studenter/moduler kunde inte hittas.");
            }

            return ResponseEntity.ok().body("Betyg uppdaterade: " + updatedCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid registreringen: " + e.getMessage());
        }
    }
}