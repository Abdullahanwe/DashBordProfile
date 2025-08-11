import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsService, Project } from '../../components/projects/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects {
  form: FormGroup;
  projects: Project[] = [];
  isEditing = false;
  currentId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  timestamp: number = Date.now();

  constructor(private fb: FormBuilder, private projectsService: ProjectsService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      demoLink: [''],
      githubLink: [''],
      image: [null]
    });


    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getAll().subscribe({
      next: (response) => {
        this.projects = response.data.map(project => ({
          ...project,
          image: project.image ? this.getFullImageUrl(project.image) : undefined
        }));
        this.timestamp = Date.now();
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
        this.projects = [];
      }
    });
  }

  private getFullImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/uploads/projects/${imagePath}`;
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title.trim());
    formData.append('description', this.form.value.description.trim());
    formData.append('demoLink', this.form.value.demoLink?.trim() || '');
    formData.append('githubLink', this.form.value.githubLink?.trim() || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    } else if (this.previewUrl && typeof this.previewUrl === 'string') {

      const imageName = this.previewUrl.split('/').pop();
      formData.append('existingImage', imageName || '');
    }

    const request$ = this.isEditing && this.currentId
      ? this.projectsService.update(this.currentId, formData)
      : this.projectsService.create(formData);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadProjects();
      },
      error: (err) => console.error('Failed to save project:', err)
    });
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  editProject(project: Project) {
    this.form.patchValue({
      title: project.title,
      description: project.description,
      image: project.image,
      demoLink: project.demoLink || '',
      githubLink: project.githubLink || '',
    });
    this.isEditing = true;
    this.currentId = project._id || null;
    this.previewUrl = project.image || null;
  }

  resetForm() {
    this.form.reset();
    this.isEditing = false;
    this.currentId = null;
    this.selectedFile = null;
    this.previewUrl = null;
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

    this.projectsService.delete(this.confirmDeleteId).subscribe(() => {
      this.loadProjects();
      this.cancelDelete();
    });
  }

  private markFormAsTouched() {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
