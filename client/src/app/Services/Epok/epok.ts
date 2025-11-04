import { Injectable } from '@angular/core';

export interface EpokCourse {
  courseCode: string;
  field?: string;
  type?: string;
}

export interface EpokModule {
  moduleId: string;
  courseCode: string;
  description: string;
  credits: number;
  status: 'Active' | 'Inactive';
  mandatory: boolean;
  fromPeriod: string;
  moduleCode: string;
  gradeScale: string;
}

@Injectable({
  providedIn: 'root',
})
export class EpokService {
  courses: EpokCourse[] = [
    { courseCode: 'D0021N', field: 'IT-projekt', type: 'Kurs' },
    { courseCode: 'D7001N', field: 'Programmering', type: 'Kurs' },
  ];

  modules: EpokModule[] = [
    {
      moduleId: 'M001',
      courseCode: 'D0021N',
      description: 'Projektarbete och reflektion',
      credits: 7.5,
      status: 'Active',
      mandatory: true,
      fromPeriod: 'VT2025',
      moduleCode: 'P1',
      gradeScale: 'U-G-VG',
    },
    {
      moduleId: 'M002',
      courseCode: 'D7001N',
      description: 'Individuell programmeringsuppgift',
      credits: 4.0,
      status: 'Active',
      mandatory: false,
      fromPeriod: 'HT2024',
      moduleCode: 'P2',
      gradeScale: 'U-G',
    },
  ];
}