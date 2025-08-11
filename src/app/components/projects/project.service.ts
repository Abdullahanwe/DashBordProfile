import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  demoLink?: string;
  githubLink?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://localhost:3000/project';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ message: string, data: Project[] }> {
    return this.http.get<{ message: string, data: Project[] }>(this.apiUrl);
  }

  create(projectData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  update(id: string, projectData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projectData);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
