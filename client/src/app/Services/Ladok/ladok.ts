import { Injectable } from "@angular/core";
import { EpokService, Course } from "../Epok/epok";
import { StudentITSService, Student } from "../StudentITS/student-its";

interface Grades {
  Module_Code: string;
  Grade: string | null;
  Date: Date | null;
  Status: string | null;
}

interface Enrollment {
  Student: Student;
  Course: Course;
  Grades: Grades[];
}


@Injectable({
  providedIn: 'root',
})

export class LadokService {
  private courses: Course[] = [];
  private students: Student[] = [];
  private enrollments: Enrollment[] = [];

  enrollStudents() {
    for (let student of this.students) {
      for (let course of this.courses) {
        const grades: Grades[] = [];
        for (let module of course.Modules) {
          grades.push({Module_Code: module.Module_Code, Grade: null, Date: null, Status: null})
        }
        const enrollment: Enrollment = {
          Student: student,
          Course: course,
          Grades: grades
        };
        this.enrollments.push(enrollment);
      }
    }
  }

  constructor(
    private epok: EpokService,
    private studentITS: StudentITSService
  ) {

    this.courses = this.epok.getCourses();
    this.students = this.studentITS.getStudents();
    this.enrollStudents();
  }

  getStudentGradeForModule(courseCode: string, moduleCode: string): any[] {
    const results: any[] = [];
    for (let enrollment of this.enrollments) {
      if (enrollment.Course.CourseCode === courseCode) {
        const gradeEntry = enrollment.Grades.find(grade => grade.Module_Code === moduleCode);
        results.push({
          Student_id: enrollment.Student.Student_id,
          full_name: `${enrollment.Student.first_name} ${enrollment.Student.last_name}`,
          Grade: gradeEntry?.Grade,
          Date: gradeEntry?.Date,
          Status: gradeEntry?.Status
        });
      }
    }
    return results;
  }

  saveGradesForStudentsInModule(
    updatedStudents: {
      Student_id: string;
      Grade: string | null;
      Date: Date | null;
      Status: string | null;
    }[],
    courseCode: string,
    moduleCode: string
  ): void {
  
    for (const updatedStudent of updatedStudents) {
  
      const enrollment = this.enrollments.find(
        e =>
          e.Student.Student_id === updatedStudent.Student_id &&
          e.Course.CourseCode === courseCode
      )!;

      console.log(enrollment)
  
      const gradeEntry = enrollment.Grades.find(
        g => g.Module_Code === moduleCode
      )!;

      gradeEntry.Grade = updatedStudent.Grade;
      gradeEntry.Date = updatedStudent.Date;
      gradeEntry.Status = updatedStudent.Status;
    }

    console.log('Grades saved successfully.');
  }  
}  