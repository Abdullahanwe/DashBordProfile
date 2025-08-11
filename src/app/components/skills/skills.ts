import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SkillsService, SkillIn } from '../../components/skills/skill.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrls: ['./skills.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class Skills implements OnInit {
  skills: SkillIn[] = [];
  currentSkill: SkillIn = { name: '', level: '', icon: '' };
  isEditing = false;

  constructor(private skillsService: SkillsService) {}

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    this.skillsService.getSkills().subscribe({
      next: (res) => this.skills = res.data,
      error: (err) => console.error('Error fetching skills:', err)
    });
  }

  addSkill() {
    if (!this.currentSkill.name || !this.currentSkill.level) {
      alert('Please fill in all required fields.');
      return;
    }

    this.skillsService.addSkill(this.currentSkill).subscribe({
      next: () => {
        this.getSkills();
        this.resetForm();
      },
      error: (err) => console.error('Error adding skill:', err)
    });
  }

  updateSkill() {
    if (!this.currentSkill._id) return;

    this.skillsService.updateSkill(this.currentSkill).subscribe({
      next: () => {
        this.getSkills();
        this.resetForm();
      },
      error: (err) => console.error('Error updating skill:', err)
    });
  }

  startEdit(skill: SkillIn) {
    this.currentSkill = { ...skill };
    this.isEditing = true;
  }

  confirmDeleteId: string | null = null;
showDeleteConfirm = false;

askDelete(id: string): void {
  this.confirmDeleteId = id;
  this.showDeleteConfirm = true;
}

cancelDelete(): void {
  this.showDeleteConfirm = false;
  this.confirmDeleteId = null;
}

confirmDelete(): void {
  if (!this.confirmDeleteId) return;

  this.skillsService.deleteSkill(this.confirmDeleteId).subscribe(() => {
    this.getSkills();
    this.cancelDelete(); // إخفاء نافذة التأكيد
  });
}
  resetForm() {
    this.currentSkill = { name: '', level: '', icon: '' };
    this.isEditing = false;
  }
}
