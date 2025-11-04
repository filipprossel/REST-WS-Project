import { Injectable } from '@angular/core';

export interface CourseModule {
  Module_Id: string,
  Description: string,
  Credits: number,
  Mandatory: boolean,
  Start_Date: Date,
  End_Date: Date,
  Module_Code: string,
  Grade_Scale: string,
}

export interface Course {
  CourseCode: string;
  Modules: CourseModule[];
}

const TestCourses: Course[] = [
  {
    CourseCode: 'D0001N',
    Modules: [
      {
        Module_Id: '1',
        Description: 'Uppgifter',
        Credits: 5,
        Mandatory: true,
        Start_Date: new Date('2023-09-01'),
        End_Date: new Date('2023-12-15'),
        Module_Code: '0001',
        Grade_Scale: 'U,G,VG'
      },
      {
        Module_Id: '2',
        Description: 'Tentamen',
        Credits: 2.5,
        Mandatory: true,
        Start_Date: new Date('2023-09-01'),
        End_Date: new Date('2023-12-15'),
        Module_Code: '0002',
        Grade_Scale: 'U,G,VG'
      }
    ]
  },
  {
    CourseCode: 'D0002N',
    Modules: [
      {
        Module_Id: '3',
        Description: 'Uppgifter',
        Credits: 7.5,
        Mandatory: true,
        Start_Date: new Date('2024-01-15'),
        End_Date: new Date('2024-05-01'),
        Module_Code: '0001',
        Grade_Scale: 'U,G,VG'
      }
    ]
  },
  {
    CourseCode: 'D0003N',
    Modules: [
      {
        Module_Id: '4',
        Description: 'Projektarbete',
        Credits: 10,
        Mandatory: true,
        Start_Date: new Date('2024-02-01'),
        End_Date: new Date('2024-06-01'),
        Module_Code: '0001',
        Grade_Scale: 'U,G,VG'
      },
      {
        Module_Id: '5',
        Description: 'Laborationer',
        Credits: 5,
        Mandatory: false,
        Start_Date: new Date('2024-02-15'),
        End_Date: new Date('2024-05-15'),
        Module_Code: '0002',
        Grade_Scale: 'U,G,VG'
      }
    ]
  },
  {
    CourseCode: 'D0004N',
    Modules: [
      {
        Module_Id: '6',
        Description: 'Föreläsningar',
        Credits: 3,
        Mandatory: true,
        Start_Date: new Date('2024-03-01'),
        End_Date: new Date('2024-06-01'),
        Module_Code: '0001',
        Grade_Scale: 'U,G,VG'
      },
      {
        Module_Id: '7',
        Description: 'Seminarium',
        Credits: 2,
        Mandatory: false,
        Start_Date: new Date('2024-03-15'),
        End_Date: new Date('2024-05-15'),
        Module_Code: '0002',
        Grade_Scale: 'U,G,VG'
      },
      {
        Module_Id: '8',
        Description: 'Examination',
        Credits: 5,
        Mandatory: true,
        Start_Date: new Date('2024-05-20'),
        End_Date: new Date('2024-06-01'),
        Module_Code: '0003',
        Grade_Scale: 'U,G,VG'
      }
    ]
  },
  {
    CourseCode: 'D0005N',
    Modules: [
      {
        Module_Id: '9',
        Description: 'Online-uppgifter',
        Credits: 4,
        Mandatory: true,
        Start_Date: new Date('2024-04-01'),
        End_Date: new Date('2024-07-01'),
        Module_Code: '0001',
        Grade_Scale: 'U,G,VG'
      },
      {
        Module_Id: '10',
        Description: 'Slutprojekt',
        Credits: 6,
        Mandatory: true,
        Start_Date: new Date('2024-06-01'),
        End_Date: new Date('2024-08-15'),
        Module_Code: '0002',
        Grade_Scale: 'U,G,VG'
      }
    ]
  }
];

@Injectable({
  providedIn: 'root',
})

export class EpokService {
  courses: Course[] = TestCourses;

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseByCode(courseCode: string): Course | undefined {
    return this.courses.find(course => course.CourseCode === courseCode);
  }

  getModulesByCourseCode(courseCode: string): CourseModule[] | undefined {
    const course = this.getCourseByCode(courseCode);
    return course ? course.Modules : undefined;
  }
}