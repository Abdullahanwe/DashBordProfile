
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isCollapsed = false;
  isMobile = window.innerWidth < 992;
  isMobileOpen = false;

  navItems = [
    { label: 'Dashboard', link: '/', icon: 'bi bi-house-door' },
    { label: 'About', link: '/about', icon: 'bi bi-person' },
    { label: 'Projects', link: '/projects', icon: 'bi bi-folder' },
    { label: 'Certification', link: '/certification', icon: 'bi bi-award' },
    { label: 'Skills', link: '/skills', icon: 'bi bi-tools' },
    { label: 'Contact', link: '/contact', icon: 'bi bi-envelope' }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.isMobileOpen = false;
    }
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
  }

  toggleCollapse() {
    if (this.isMobile) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeOnMobile() {
    if (this.isMobile) {
      this.isMobileOpen = false;
    }
  }

  closeSidebar() {
    this.isMobileOpen = false;
  }
}
