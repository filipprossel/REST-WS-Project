import { Injectable } from '@angular/core';

export interface Student {
  Student_id: string,
  SSN: string,
  first_name: string,
  last_name: string,
  student_mail: string
}

const TestData = [
  {
    Student_id: 'S001',
    SSN: '19900101-1234',
    first_name: 'Alice',
    last_name: 'Andersson',
    student_mail: 'alice.andersson@example.com'
  },
  {
    Student_id: 'S002',
    SSN: '19900202-2345',
    first_name: 'Björn',
    last_name: 'Berg',
    student_mail: 'bjorn.berg@example.com'
  },
  {
    Student_id: 'S003',
    SSN: '19900303-3456',
    first_name: 'Carina',
    last_name: 'Carlsson',
    student_mail: 'carina.carlsson@example.com'
  },
  {
    Student_id: 'S004',
    SSN: '19900404-4567',
    first_name: 'David',
    last_name: 'Dahl',
    student_mail: 'david.dahl@example.com'
  },
  {
    Student_id: 'S005',
    SSN: '19900505-5678',
    first_name: 'Elin',
    last_name: 'Eriksson',
    student_mail: 'elin.eriksson@example.com'
  },
  {
    Student_id: 'S006',
    SSN: '19900606-6789',
    first_name: 'Fredrik',
    last_name: 'Fredlund',
    student_mail: 'fredrik.fredlund@example.com'
  },
  {
    Student_id: 'S007',
    SSN: '19900707-7890',
    first_name: 'Greta',
    last_name: 'Gustafsson',
    student_mail: 'greta.gustafsson@example.com'
  },
  {
    Student_id: 'S008',
    SSN: '19900808-8901',
    first_name: 'Hugo',
    last_name: 'Hansson',
    student_mail: 'hugo.hansson@example.com'
  },
  {
    Student_id: 'S009',
    SSN: '19900909-9012',
    first_name: 'Isabelle',
    last_name: 'Isaksson',
    student_mail: 'isabelle.isaksson@example.com'
  },
  {
    Student_id: 'S010',
    SSN: '19901010-0123',
    first_name: 'Johan',
    last_name: 'Johansson',
    student_mail: 'johan.johansson@example.com'
  }
];

@Injectable({
  providedIn: 'root',
})

export class StudentITSService {
  students: Student[] = TestData;

  getStudents(): Student[] {
    return this.students;
  }

  getStudentBySSN(ssn: string): Student | undefined {
    return this.students.find(student => student.SSN === ssn);
  }

  getStudentById(studentId: string): Student | undefined {
    return this.students.find(student => student.Student_id === studentId);
  }
}