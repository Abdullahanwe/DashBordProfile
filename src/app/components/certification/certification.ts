import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CertificationService, CertificationIn } from '../../components/certification/certivification.service';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certification.html',
  styleUrls: ['./certification.css']
})
export class Certification implements OnInit {
  certifications: CertificationIn[] = [];
  form!: FormGroup;
  isEditing = false;
  editId: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private certService: CertificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      organization: ['', Validators.required],
      issueDate: [''],
      expirationDate: [''],
      credentialId: [''],
      credentialUrl: ['']
    });

    this.loadCertifications();
  }

  loadCertifications() {
    this.certService.getAll().subscribe(res => {
      const raw = Array.isArray(res) ? res : res.data || [];
      this.certifications = raw.map((c: any) => ({
        ...c,
        id: c._id || c.id
      }));
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0] || null;
  }

  submitForm() {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    if (this.selectedFile) formData.append('image', this.selectedFile);

    if (this.isEditing && this.editId) {
      this.certService.update(this.editId, formData).subscribe(updated => {
        const idx = this.certifications.findIndex(c => c.id === this.editId);
        if (idx > -1) this.certifications[idx] = { ...updated, id: updated._id || updated.id };
        this.resetForm();
      });
    } else {
      this.certService.create(formData).subscribe(newCert => {
        this.certifications.push({ ...newCert, id: newCert._id || newCert.id });
        this.resetForm();
      });
    }
  }

  editCertification(cert: CertificationIn) {
    this.isEditing = true;
    this.editId = cert.id!;
    this.form.patchValue(cert);
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

  this.certService.delete(this.confirmDeleteId).subscribe(() => {
    this.loadCertifications();
    this.cancelDelete(); // إخفاء نافذة التأكيد
  });
}

  resetForm() {
    this.form.reset();
    this.selectedFile = null;
    this.isEditing = false;
    this.editId = null;
  }
}
