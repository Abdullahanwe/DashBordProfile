import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../components/contact/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  contacts: any[] = [];

  constructor(private contactService: ContactService) {
    this.getContacts();
  }

  getContacts() {
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contacts = res.data;
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
      }
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

    this.contactService.delete(this.confirmDeleteId).subscribe(() => {
      this.getContacts();
      this.cancelDelete(); // إخفاء نافذة التأكيد
    });
  }

}
