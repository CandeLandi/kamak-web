import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'kamak-header',
  standalone: true,
  imports: [RouterModule],
  template: `
<header class="nav" id="nav">
  <div class="wrap nav__in">
    <a class="nav__logo" routerLink="/" aria-label="Kamak Desarrollos">
      <img class="light" src="assets/kamak/kamak-logo-light.png" alt="Kamak Desarrollos">
      <img class="dark" src="assets/kamak/kamak-logo.png" alt="Kamak Desarrollos">
    </a>
    <nav class="nav__links">
      <a routerLink="/" fragment="nosotros">Nosotros</a>
      <a routerLink="/obras">Obras</a>
      <a routerLink="/" fragment="entregamos">Qué entregamos</a>
      <a routerLink="/" fragment="formatos">Formatos</a>
      <a routerLink="/" fragment="contacto">Contacto</a>
    </nav>
    <div class="nav__cta">
      <a class="btn btn--ghost" routerLink="/obras">Ver las obras</a>
      <a class="btn btn--primary" routerLink="/" fragment="contacto">Cotizar mi tienda <span class="arr">→</span></a>
    </div>
    <button class="nav__burger" aria-label="Menú"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu">
  <a routerLink="/" fragment="nosotros"><span class="diamond"></span>Nosotros</a>
  <a routerLink="/obras"><span class="diamond"></span>Obras</a>
  <a routerLink="/" fragment="entregamos"><span class="diamond"></span>Qué entregamos</a>
  <a routerLink="/" fragment="formatos"><span class="diamond"></span>Formatos</a>
  <a routerLink="/" fragment="contacto"><span class="diamond"></span>Contacto</a>
  <div class="mobile-menu__cta">
    <a class="btn btn--primary btn--block" routerLink="/" fragment="contacto">Cotizar mi tienda →</a>
    <a class="btn btn--ghost btn--block" routerLink="/obras">Ver las obras</a>
  </div>
</div>
`,
})
export class KamakHeaderComponent {}
