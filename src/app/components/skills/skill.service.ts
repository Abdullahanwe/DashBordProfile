import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SkillIn {
  _id?: string;
  name: string;
  level: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private apiUrl = 'http://localhost:3000/skill';

  constructor(private http: HttpClient) {}


  getSkills(): Observable<{ message: string; data: SkillIn[] }> {
    return this.http.get<{ message: string; data: SkillIn[] }>(this.apiUrl);
  }


  addSkill(skill: SkillIn): Observable<any> {
    return this.http.post(this.apiUrl, skill);
  }


  updateSkill(skill: SkillIn): Observable<any> {
    return this.http.put(`${this.apiUrl}/${skill._id}`, skill);
  }


  deleteSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
