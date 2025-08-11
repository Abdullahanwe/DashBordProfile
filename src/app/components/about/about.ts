import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {
  abouts: any[] = [];
  aboutForm!: FormGroup;
  isEditing = false;
  editId: string | null = null;
  isLoading = false;
  error = '';
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private aboutService: AboutService) { }

  ngOnInit(): void {
    this.loadAbouts();
    this.initForm();
  }

  initForm(): void {
    this.aboutForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      socialLinks: this.fb.array([])
    });
  }

  get socialLinks(): FormArray {
    return this.aboutForm.get('socialLinks') as FormArray;
  }

  addSocialLink(): void {
    const linkGroup = this.fb.group({
      name: ['', Validators.required],
      icon: ['fab fa-link'],
      url: ['', [Validators.required]],
      color: ['#3b5998']
    });
    this.socialLinks.push(linkGroup);
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }
  isFormVisible = true;
  loadAbouts(): void {
    this.isLoading = true;
    this.aboutService.getAll().subscribe({
      next: data => {
        const baseUrl = 'http://localhost:3000/uploads/about/';
        this.abouts = Array.isArray(data) ? data : (data.data || []).map((item: any) => ({
          ...item,
          imageUrl: item.image ? baseUrl + item.image : null
        }));
        this.isFormVisible = this.abouts.length === 0;
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
  }

  submitForm(): void {
    if (this.aboutForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.aboutForm.value.title);
    formData.append('description', this.aboutForm.value.description);
    formData.append('socialLinks', JSON.stringify(this.aboutForm.value.socialLinks));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log({
      title: this.aboutForm.value.title,
      description: this.aboutForm.value.description,
      socialLinks: this.aboutForm.value.socialLinks,

      image: this.selectedFile

    });


    if (this.isEditing && this.editId) {
      this.aboutService.update(this.editId, formData).subscribe({
        next: () => {

          this.resetForm();
          this.loadAbouts();
          this.isFormVisible = false;
        }
      });
    } else {
      this.aboutService.create(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadAbouts();
          this.isFormVisible = false;
        }
      });
    }
  }

  editAbout(about: any): void {
    this.isFormVisible = true;
    this.isEditing = true;
    this.editId = about.id || about._id;
    this.aboutForm.patchValue({
      title: about.title,
      description: about.description
    });
    this.socialLinks.clear();
    about.socialLinks.forEach((link: any) => {
      this.socialLinks.push(this.fb.group(link));
    });
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

  this.aboutService.delete(this.confirmDeleteId).subscribe(() => {
    this.loadAbouts();
    this.cancelDelete();
  });
}

  resetForm(): void {
    this.isEditing = false;
    this.editId = null;
    this.selectedFile = null;
    this.aboutForm.reset();
    this.socialLinks.clear();
  }
}
