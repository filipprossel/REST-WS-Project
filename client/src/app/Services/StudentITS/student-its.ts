import { Injectable } from '@angular/core';

export interface StudentITS {
  studentId: string;
  SSN: string;
  firstName: string;
  lastName: string;
  studentMail: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentITSService {
  students: StudentITS[] = [
    {
      studentId: 'S001',
      SSN: '19990101-1234',
      firstName: 'Ann',
      lastName: 'Andersson',
      studentMail: 'ann.andersson@student.ltu.se',
    },
    {
      studentId: 'S002',
      SSN: '19981212-5678',
      firstName: 'Bertil',
      lastName: 'Bertilsson',
      studentMail: 'bertil.bertilsson@student.ltu.se',
    },
    {
      studentId: 'S003',
      SSN: '19970505-1111',
      firstName: 'Calle',
      lastName: 'Carlsson',
      studentMail: 'calle.carlsson@student.ltu.se',
    },
  ];
}