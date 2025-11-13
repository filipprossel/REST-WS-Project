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
import { Message } from 'primeng/message';
import { LadokAPIService } from '../../Services/api/ladok-apiservice';


type primeNgSeverity = "success" | "error" | "info" | "warn" | "secondary" | "contrast" | null | undefined;

@Component({
  selector: 'app-grading',
  imports: [TagModule, Message, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, CommonModule, TableModule, AutoCompleteModule, ButtonModule, DatePickerModule, FormsModule, Select],
  templateUrl: './grading.html',
  styleUrl: './grading.scss',
})

export class Grading implements OnInit {
  allCourseCodes: string[]= [];
  selectedCourseCode: string = '';

  availableModules: string[] = [];
  selectedModuleCode: string = '';

  students: any[] = [];
  selectedStudents: any[] = [];

  grades: string[] = [];
  status: string[] = ['Klarmarkerad', 'Attesterat'];

  currentUploadState: primeNgSeverity = null;
  uploadMessage: string = '';


  constructor(
    private LadokAPI: LadokAPIService,
  ) {
    effect(() => {
      this.loadCourseDate();

      this.updateStudentsList();
      this.updateModuleInfo();
    });
  }

  ngOnInit(): void {
    this.LadokAPI.initialLoad()
  }

  updateModuleInfo() {
    const courseData = this.LadokAPI.selectedCourseAndModuleData();
    const moduleData = courseData?.["epok"];
    const moduleObject = moduleData as unknown as { description: string } | undefined;
    this.grades = moduleObject?.description?.split(' ') ?? [];
  }

  updateStudentsList() {
    const courseData = this.LadokAPI.selectedCourseAndModuleData();
    const studentData = courseData?.["studentITS"] ?? [];

    console.log('Uppdaterar studentlista med data:', studentData);

    studentData.forEach(student => {
      this.students.push({
        ...student,
        id: student.ssn,
        isEditable: student.status === 'Utkast' || !student.status,
      })
    })
  }

  loadCourseDate() {
    this.allCourseCodes = Object.keys(this.LadokAPI.courseAndModules());
  }

  courseCodeSelected() {
    this.selectedModuleCode = '';
    this.students = [];
    this.availableModules = this.LadokAPI.courseAndModules()[this.selectedCourseCode] || [];
  }

  moduleSelected() {
    this.students = [];
    this.LadokAPI.getStudents(this.selectedCourseCode!, this.selectedModuleCode!);
  }

  saveSelectedStudents() {

    const studentsToUpdate = this.selectedStudents.map(student => {
      this.currentUploadState = 'info';
      this.uploadMessage = 'Uppdaterar studenter...';

      student.grade = student.newGrade || student.grade || null
      student.date = student.newDate || student.date || null

      if (student.grade && student.date) {
        student.status = student.newStatus || student.status || 'Utkast'
      } else {
        student.status = 'Utkast'
      }

      student.isEditable = student.status === 'Utkast' || !student.status

      return {
        student_courses_id: student.student_courses_id,
        module_code: this.selectedModuleCode,
        result_id: student.result_id,
        grade: student.grade,
        date: student.date,
        status: student.status,
      }
    });

    this.selectedStudents = [];


    if (studentsToUpdate.length === 0) {
      console.log('Inga studenter valda.');
      return;
    }

    this.LadokAPI.updateResult(studentsToUpdate).subscribe({
      
      next: (res) => {
        console.log('Uppdatering lyckades:', res);
        this.currentUploadState = 'success';
        this.uploadMessage = 'Uppdatering lyckades!';

      },
      error: (err) => {
        console.error('Uppdatering misslyckades:', err);
        this.currentUploadState = 'error';
        this.uploadMessage = 'Uppdatering misslyckades.';
      }
    });

    setTimeout(() => {
      this.currentUploadState = null;
      this.uploadMessage = '';
    }, 3000);
  }
}
