import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  heroImage = 'assets/images/construction-site/kamak-developments.webp';
  badges = ['Diseño + obra', 'Fabricación propia', 'Equipo técnico permanente'];
}
