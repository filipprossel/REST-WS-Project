import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { LadokService } from '../../Services/Ladok/ladok';
import { EpokService } from '../../Services/Epok/epok';

@Component({
  selector: 'app-grading',
  imports: [TagModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, CommonModule, TableModule, AutoCompleteModule, ButtonModule, DatePickerModule, FormsModule, Select],
  templateUrl: './grading.html',
  styleUrl: './grading.scss',
})

export class Grading implements OnInit {

  grades = ['U', 'G', 'VG'];
  status = ['Klarmarkerad', 'Attesterad'];
  student: any;
  allCourseCodes: string[] = [];
  selectedCourseCode: string | null = null;
  courseModules: string[] = [];
  selectedModuleCode: string | null = null;
  studentsInCourse: any[] = [];
  selectedStudents: any[] = [];

  onCourseSelected(event: any) {
    this.courseModules = this.epok.getCourseByCode(this.selectedCourseCode!)?.Modules.map(module => module.Module_Code) || [];
    this.selectedModuleCode = null;
    this.selectedStudents = [];
    this.studentsInCourse = [];
  }

  onModuleSelected(event: any) {
    this.studentsInCourse = this.ladok
    .getStudentGradeForModule(this.selectedCourseCode!, this.selectedModuleCode!)
    .map((student, index) => ({
      ...student,
      id: student.SSN || index  
    }));

    console.log('Students in course:', this.studentsInCourse);
    this.selectedStudents = [];
  }
  
  saveSelectedStudents(event: any) {
    console.log('Selected students:', this.selectedStudents);

    const studentsToUpdate = [];

    for (let student of this.selectedStudents) {
      if (student.Grade && student.Date && student.selectedStatus) {
        studentsToUpdate.push({ ...student, Status: student.selectedStatus });
      } else if (student.selectedStatus && !student.Date && !student.Grade) {
        continue;
      } else {
        studentsToUpdate.push({ ...student, Status: "Utkast" });
      }
    }

    this.ladok.saveGradesForStudentsInModule(studentsToUpdate!, this.selectedCourseCode!, this.selectedModuleCode!);

    this.studentsInCourse = this.ladok
    .getStudentGradeForModule(this.selectedCourseCode!, this.selectedModuleCode!)
    .map((student, index) => ({
      ...student,
      id: student.SSN || index  
    }));

    console.log('Updated students in course:', this.studentsInCourse);
    this.selectedStudents = [];
  }  

  constructor(
    private ladok: LadokService,
    private epok: EpokService
  ) {}
  
  ngOnInit() {
    this.allCourseCodes = this.epok.getCourses().map(course => course.CourseCode);
    console.log(this.allCourseCodes);
  }
}
