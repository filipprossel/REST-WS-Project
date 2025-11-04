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
import { EpokModule, EpokService } from '../../Services/Epok/epok';
import { Results, LadokService } from '../../Services/Ladok/ladok';
import { StudentITS, StudentITSService } from '../../Services/StudentITS/student-its';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grading',
  imports: [TagModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, CommonModule, TableModule, AutoCompleteModule, ButtonModule, DatePickerModule, FormsModule, Select],
  templateUrl: './grading.html',
  styleUrl: './grading.scss',
})

export class Grading implements OnInit {

  courses: EpokModule[] = [];
  results: Results[] = [];
  students: StudentITS[] = [];
  grades = ['U', 'G', 'VG', '*'];
  status = ['Klarmarkerad', 'Attesterad', 'Förberett'];

  constructor(
    private epok: EpokService,
    private ladok: LadokService,
    private studentITS: StudentITSService
  ) {}
  
  ngOnInit() {
    console.log('EPOK-kurser:', this.epok.courses);
    console.log('LADOK-resultat:', this.ladok.getResults);
    console.log('ITS-studenter:', this.studentITS.students);

    this.courses = this.epok.modules;
    this.results = this.ladok.getResults();
    this.students = this.studentITS.students;
  }

  student: any;
}
