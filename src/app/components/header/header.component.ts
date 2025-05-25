import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  scrolled = false;
  pastLogo = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.scrolled = window.scrollY > 50;
    this.pastLogo = window.scrollY > 100;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
