import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
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
import { LadokAPIService } from '../../Services/api/ladok-apiservice';
import { single } from 'rxjs';

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

  // nytt 
    this.ladokAPI.getStudents(this.selectedCourseCode!, this.selectedModuleCode!);

  }
  

  saveSelectedStudents() {
  const studentsToUpdate = this.selectedStudents
    .filter(student => student.grade || student.date || student.Status)
    .map(student => ({
      student_courses_id: student.student_courses_id,
      module_Code: this.selectedModuleCode!,
      grade: student.grade ?? null,
      date: student.date
        ? new Date(student.date).toISOString().substring(0, 19)
        : null,
      status: student.Status ?? "Utkast",
    }));

  if (studentsToUpdate.length === 0) {
    console.log('Inga studenter valda.');
    return;
  }

  this.ladokAPI.updateResult(studentsToUpdate).subscribe({
    next: (response) => {
      console.log('Betyg uppdaterade:', response);

      this.selectedStudents = [...[]];

      this.ladokAPI.getStudents(this.selectedCourseCode!, this.selectedModuleCode!);
    },
    error: (err) => {
      console.error('Fel vid uppdatering:', err);
    },
  });
}




  constructor(
    private ladok: LadokService,
    private epok: EpokService,
    private ladokAPI: LadokAPIService
  ) {}

  coursesAndModules!: Record<string, string[]>; 
  allcourseCode!: any[];

  ngOnInit() {
    this.ladokAPI.initialLoad();

    console.log(this.coursesAndModules)

    // epok data
    this.allCourseCodes = this.epok.getCourses().map(course => course.CourseCode);
    console.log(this.allCourseCodes);

  }


  get courseAndModulesEPok() {
    return this.ladokAPI.courseAndModules()["epok"]; // hämtar signalvärdet epok
  }


  get allCourseCodes2() {
    const courses = this.ladokAPI.courseAndModules();
    return Object.keys(courses)
  }

  courseModulesFromSelectedCourse(): any[] {
    const courses = this.ladokAPI.courseAndModules();
    // console.log(courses)
    return  courses[this.selectedCourseCode??  ""] || []
  }




    get studentsInCourseData(): any {
    const data = this.ladokAPI.selectedCourseAndModuleData();

      const students = data?.["studentITS"] ?? [];

        students.forEach(d => {
        d.isEditable = d.status === 'Utkast' || !d.status;
      });

        // console.log(data["studentITS"])
        return data["studentITS"]
  }

}
