package com.example.demo.StudnetITS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class StudentITSService {
    @Autowired
    StudentITSRepository studentITSRepository;

    public ArrayList<StudentITSStudent> findStudentsBySSN(ArrayList<String> listSSN){
        ArrayList<StudentITSStudent> studentList = new ArrayList<>();
        for(String SSN : listSSN){
            studentList.add(studentITSRepository.findStudentITSStudentBySSN(SSN));
        }
        return studentList;
    }
}
