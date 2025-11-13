package com.example.demo.Ladok;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


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
    public ResponseEntity<?> getCourseData(@RequestParam String courseCode, @RequestParam String module_code) {

        Map<String, Object> courseDataFromModule = new HashMap<>();
        List<Map<String, Object>> studentITSList;

        try {
            // --- 1. Hämta moduldata från EPOK ---
            String urlEpok = "http://localhost:8080/epok/course/moduledataforcourse?course_code={course_code}&module_code={module_code}";
            Map<String, String> params = Map.of(
                    "course_code", courseCode,
                    "module_code", module_code
            );

            ResponseEntity<Map<String, Object>> responseEpok =
                    restTemplate.exchange(
                            urlEpok,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<Map<String, Object>>() {},
                            params
                    );

            if (!responseEpok.getStatusCode().is2xxSuccessful() || responseEpok.getBody() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Kan inte hitta kursdata i EPOK");
            }

            courseDataFromModule.put("epok", responseEpok.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid anrop till EPOK: " + e.getMessage());
        }

        try {
            // --- 2. Hämta alla LADOK-studenter (för student_courses_id) ---
            List<Map<String, Object>> studentsInCourse = jdbcTemplate.queryForList(
                    "SELECT student_courses_id, SSN FROM LADOK_student_courses WHERE course_code = ?",
                    courseCode
            );

            if (studentsInCourse.isEmpty()) {
                courseDataFromModule.put("studentITS", Collections.emptyList());
                return ResponseEntity.ok(courseDataFromModule);
            }

            // --- 3. Hämta ITS-data baserat på ALLA SSN från LADOK ---
            Set<String> uniqueSSN = studentsInCourse.stream()
                    .map(s -> s.get("SSN").toString())
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            String urlITS = "http://localhost:8080/studentITS/getStudents";
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlITS);
            for (String ssn : uniqueSSN) {
                builder.queryParam("listSSN", ssn);
            }

            ResponseEntity<List<Map<String, Object>>> responseITS =
                    restTemplate.exchange(
                            builder.toUriString(),
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
                    );

            if (!responseITS.getStatusCode().is2xxSuccessful() || responseITS.getBody() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hittade inga studenter i ITS");
            }

            studentITSList = responseITS.getBody();

            // --- 4. Ta bort dubbletter i ITS-data baserat på SSN ---
            Map<String, Map<String, Object>> uniqueITSMap = new LinkedHashMap<>();
            for (Map<String, Object> itsStudent : studentITSList) {
                String ssn = itsStudent.get("ssn") != null ? itsStudent.get("ssn").toString() : null;
                if (ssn != null && !uniqueITSMap.containsKey(ssn)) {
                    uniqueITSMap.put(ssn, itsStudent);
                }
            }
            List<Map<String, Object>> filteredITS = new ArrayList<>(uniqueITSMap.values());

            // --- 5. Koppla student_courses_id till ITS-data ---
            Map<String, List<Integer>> ssnToCourseIds = studentsInCourse.stream()
                    .collect(Collectors.groupingBy(
                            s -> s.get("SSN").toString(),
                            Collectors.mapping(s -> ((Number) s.get("student_courses_id")).intValue(), Collectors.toList())
                    ));

            // --- 6. Hämta Ladok-resultat för varje ITS-student för den modul ---
            for (Map<String, Object> itsStudent : filteredITS) {
                String ssn = itsStudent.get("ssn").toString();
                List<Integer> courseIds = ssnToCourseIds.getOrDefault(ssn, Collections.emptyList());

                // För nu bara modulens betyg, kan anpassas om du vill ha alla betyg
                Map<String, Object> ladokResult = new HashMap<>();
                for (Integer studentCourseId : courseIds) {

                    System.out.println("Kollar student_courses_id: " + studentCourseId + " för modul: " + module_code);
                    itsStudent.put("student_courses_id", studentCourseId);


                    try {
                        Map<String, Object> result = jdbcTemplate.queryForObject(
                                "SELECT grade, date, status, result_id FROM LADOK_results WHERE student_courses_id = ? AND module_code = ?",
                                new Object[]{studentCourseId, module_code},
                                (rs, rowNum) -> Map.of(
                                        "grade", rs.getString("grade"),
                                        "date", rs.getObject("date"),
                                        "status", rs.getString("status"),
                                        "result_id", rs.getInt("result_id")
                                )
                        );
                        if (result != null) {
                            ladokResult.putAll(result);
                            break; // ta första träffen
                        }
                    } catch (Exception e) {
                        // Ignorera om inget resultat hittas för denna student_courses_id
                        System.out.println("Inget resultat hittades för student_courses_id: " + studentCourseId + " och modul: " + module_code);
                    }
                }


                itsStudent.put("grade", ladokResult.get("grade"));
                itsStudent.put("date", ladokResult.get("date"));
                itsStudent.put("status", ladokResult.get("status"));
                itsStudent.put("result_id", ladokResult.get("result_id"));
            }

            courseDataFromModule.put("studentITS", filteredITS);
            return ResponseEntity.ok(courseDataFromModule);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fel vid anrop till ITSStudents eller LADOK_results: " + e.getMessage());
        }
    }


    public static class GradeModuleDTO {
        public int student_courses_id;
        public String module_code;
        public Integer result_id;
        public String grade;
        public LocalDateTime date;
        public String status;

        @Override
        public String toString() {
            return "GradeModuleDTO{" +
                    "student_courses_id=" + student_courses_id +
                    ", module_code='" + module_code + '\'' +
                    ", result_id=" + result_id +
                    ", grade='" + grade + '\'' +
                    ", date=" + date +
                    ", status='" + status + '\'' +
                    '}';
        }
    }

    @PostMapping("/courses/grademodule")
    public ResponseEntity<?> patchGradeModules(@RequestBody List<GradeModuleDTO> gradeModules) {
        try {

            String insertQuery = "INSERT INTO LADOK_results (student_courses_id, module_code, grade, date, status) VALUES (?, ?, ?, ?, ?)";
            String updateQuery = "UPDATE LADOK_results SET grade=?, date=?, status=? WHERE result_id=?";

            int totalRowsAffected = 0;

            for (GradeModuleDTO gm : gradeModules) {

                System.out.println(gm);

                if (gm.result_id == null) { // Om inte result finns, skapa en ny
                    System.out.println("Infogar ny rad för student_courses_id: " + gm.student_courses_id);
                    totalRowsAffected += jdbcTemplate.update(insertQuery, gm.student_courses_id, gm.module_code, gm.grade, gm.date, gm.status);
                    System.out.println("Infogade ny rad för student_courses_id: " + gm.student_courses_id);
                } else { // Annars uppdatera befintlig rad
                    System.out.println("Uppdaterar result_id: " + gm.result_id);
                    totalRowsAffected += jdbcTemplate.update(updateQuery, gm.grade, gm.date, gm.status, gm.result_id);
                    System.out.println("Uppdaterade result_id: " + gm.result_id);
                }
            }

            System.out.println("Uppdaterade rader: " + totalRowsAffected);

            if (totalRowsAffected == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("404: Inga resultat hittades. En eller flera studenter/moduler kunde inte hittas.");
            }

            return ResponseEntity.ok(Map.of("message", "Betyg uppdaterade", "updatedCount", totalRowsAffected));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ett fel uppstod vid uppdatering av betyg: " + e.getMessage());
        }
    }
}