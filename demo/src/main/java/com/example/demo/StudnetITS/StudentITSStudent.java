package com.example.demo.StudnetITS;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="StudentITS_students")
public class StudentITSStudent {
    @Id
    private String student_id;

    private String SSN;
    private String first_name;
    private String last_name;
    private String student_mail;

    public StudentITSStudent(String student_id, String SSN, String first_name, String last_name, String student_mail){
        this.student_id = student_id;
        this.SSN = SSN;
        this.first_name = first_name;
        this.last_name = last_name;
        this.student_mail = student_mail;
    }

    public StudentITSStudent() {

    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getStudent_id() {
        return student_id;
    }

    public String getSSN() {
        return SSN;
    }

    public String getStudent_mail() {
        return student_mail;
    }
}
