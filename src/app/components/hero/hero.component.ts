import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trackWhatsAppClick } from '../../pages/home/site-interactions';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  heroImage = 'assets/hero/hero.webp';
  // Evento GA4 `clic_whatsapp` — no bloquea la navegación (gtag es async).
  trackWa(origen: string): void { trackWhatsAppClick(origen); }
}
