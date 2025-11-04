import { Injectable } from '@angular/core';

export interface Students {
  SSN: string;
}

export interface Courses {
  CourseCode: string;
}

export interface LadokStudentCourse {
  Student_Course_Id: Number;
  Student: Students;
  Course: Courses;
}

export interface Results {
  Result_Id: Number;
  Student_Course: LadokStudentCourse;
  Module_Code: string;
  Grade: 'U' | 'G' | 'VG' | '*';
  Date: string;
  Status: string;
}

@Injectable({
  providedIn: 'root',
})

export class LadokService {
  results: Results[] = [
    {
      Result_Id: 1,
      Student_Course: {
        Student_Course_Id: 101,
        Student: { SSN: '19990101-1234' },
        Course: { CourseCode: 'D0021N' },
      },
      Module_Code: 'M1',
      Grade: 'VG',
      Date: '2025-01-19',
      Status: 'Klarmarkerad',
    },
    {
      Result_Id: 2,
      Student_Course: {
        Student_Course_Id: 102,
        Student: { SSN: '19981212-5678' },
        Course: { CourseCode: 'D0021N' },
      },
      Module_Code: 'M1',
      Grade: 'G',
      Date: '2025-01-18',
      Status: 'Utkast',
    },
    {
      Result_Id: 3,
      Student_Course: {
        Student_Course_Id: 103,
        Student: { SSN: '19970505-1111' },
        Course: { CourseCode: 'D7001N' },
      },
      Module_Code: 'M2',
      Grade: 'U',
      Date: '',
      Status: 'Utkast',
    },
    {
      Result_Id: 4,
      Student_Course: {
        Student_Course_Id: 104,
        Student: { SSN: '19990909-3333' },
        Course: { CourseCode: 'D7001N' },
      },
      Module_Code: 'M2',
      Grade: 'VG',
      Date: '2025-01-19',
      Status: 'Attesterad',
    },
    {
      Result_Id: 5,
      Student_Course: {
        Student_Course_Id: 105,
        Student: { SSN: '19980202-4444' },
        Course: { CourseCode: 'D0021N' },
      },
      Module_Code: 'M1',
      Grade: 'G',
      Date: '2025-01-20',
      Status: 'Klarmarkerad',
    },
    {
      Result_Id: 6,
      Student_Course: {
        Student_Course_Id: 106,
        Student: { SSN: '19980606-2222' },
        Course: { CourseCode: 'D7001N' },
      },
      Module_Code: 'M3',
      Grade: 'U',
      Date: '',
      Status: 'Utkast',
    },
    {
      Result_Id: 7,
      Student_Course: {
        Student_Course_Id: 107,
        Student: { SSN: '20000101-9999' },
        Course: { CourseCode: 'D0021N' },
      },
      Module_Code: 'M1',
      Grade: '*',
      Date: '2025-01-22',
      Status: 'Attesterad',
    },
    {
      Result_Id: 8,
      Student_Course: {
        Student_Course_Id: 108,
        Student: { SSN: '19981111-5555' },
        Course: { CourseCode: 'D7001N' },
      },
      Module_Code: 'M3',
      Grade: 'VG',
      Date: '2025-01-23',
      Status: 'Klarmarkerad',
    },
    {
      Result_Id: 9,
      Student_Course: {
        Student_Course_Id: 109,
        Student: { SSN: '19981230-7777' },
        Course: { CourseCode: 'D7001N' },
      },
      Module_Code: 'M2',
      Grade: 'G',
      Date: '2025-01-24',
      Status: 'Attesterad',
    },
    {
      Result_Id: 10,
      Student_Course: {
        Student_Course_Id: 110,
        Student: { SSN: '19990505-8888' },
        Course: { CourseCode: 'D0021N' },
      },
      Module_Code: 'M1',
      Grade: 'U',
      Date: '',
      Status: 'Utkast',
    },
  ];

  getResults(): Results[] {
    return this.results;
  }
}
