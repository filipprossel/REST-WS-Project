import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})


export class LadokAPIService {
    constructor(private http: HttpClient) {}

      private CourseAndModulesSignal = signal<Record<string, string[]>>({});
      readonly courseAndModules = computed(() => this.CourseAndModulesSignal());


     initialLoad(): void {
      this.http.get<Record<string, string[]>>("http://localhost:8080/ladok/courses/allcoursecodeswithModules").subscribe({
      next: (res) => {
        if(res) {
          console.log(res)
          this.CourseAndModulesSignal.set(res);
        }
      },
      error: (err) => console.error('Failed to load courses', err)

     })
    }


    private selectedCourseAndModuleDataSignal = signal<Record<string, any[]>>({});
    readonly selectedCourseAndModuleData = computed(() => this.selectedCourseAndModuleDataSignal());

    getStudents(course_code: string, module_code: string): void {
      this.http.get<Record<string, string[]>>("http://localhost:8080/ladok/courses/coursedatafrommodule",{params: {
        courseCode: course_code,
        module_code: module_code,

      }}).subscribe({
        next: (res) => {
          if(res) {
            console.log(res)
            this.selectedCourseAndModuleDataSignal.set(res);
          }
        },
        error: (err) => console.error('Fel', err)
      })
    }


    updateResult(gradeModules: any[]): Observable<any> {

     return this.http.post("http://localhost:8080/ladok/courses/grademodule", gradeModules)
        // .subscribe({
        //   next: (res: any) => {
        //     console.log(res);
        //     alert(res.message || 'Resultatet uppdaterades!');
        //   },
        //   error: (err) => console.error('Failed to update result', err)
        // });

    }

}
