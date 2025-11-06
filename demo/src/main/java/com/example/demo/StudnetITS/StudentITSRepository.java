package com.example.demo.StudnetITS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface StudentITSRepository extends JpaRepository<StudentITSStudent, String> {
      StudentITSStudent findStudentITSStudentBySSN(String SSN);

}
