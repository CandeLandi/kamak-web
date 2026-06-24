import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'kamak-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
<footer class="footer">
  <div class="stripes stripes--br"><i></i></div>
  <div class="teal-band teal-band--on-carbon2 teal-band--infooter"></div>
  <div class="wrap footer__top">
    <div class="footer__brand">
      <div class="footer__logo"><img src="assets/kamak/kamak-logo-light.png" alt="Kamak Desarrollos"></div>
      <p class="footer__tagline">Innovación en servicio integral de obra. Especialistas en estaciones de servicio y retail, en todo el país.</p>
    </div>
    <div class="footer__col">
      <h4>Navegación</h4>
      <a routerLink="/" fragment="nosotros">Nosotros</a>
      <a routerLink="/obras">Obras</a>
      <a routerLink="/" fragment="entregamos">Qué entregamos</a>
      <a routerLink="/" fragment="formatos">Formatos</a>
      <a routerLink="/" fragment="contacto">Contacto</a>
    </div>
    <div class="footer__col">
      <h4>Contacto</h4>
      <a data-wa="Hola Kamak" href="https://wa.me/5492262559474?text=Hola%20Kamak" target="_blank" rel="noopener" class="mono">+54 9 2262 559474</a>
      <a href="https://wa.me/5492262353629?text=Hola%20Kamak" target="_blank" rel="noopener" class="mono">+54 9 2262 35-3629</a>
      <p class="mono">Ventas · 2262 559474</p>
      <a href="mailto:kamakdesarrollos&#64;gmail.com">kamakdesarrollos&#64;gmail.com</a>
      <a href="https://www.instagram.com/kamakdesarrollos/" target="_blank" rel="noopener">Instagram</a>
    </div>
    <div class="footer__col">
      <h4>Empresa</h4>
      <p class="mono">Conquies Soluciones<br>Constructivas S.A.</p>
      <p>Av. 42 N°3703<br>Necochea, Buenos Aires</p>
      <a class="footer__portal" href="https://app.kamak.com.ar" target="_blank" rel="noopener"><span class="diamond diamond--sm"></span> Portal del cliente</a>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <span>© {{ year }} Kamak Desarrollos · Conquies Soluciones Constructivas S.A.</span>
    <span>Necochea · Buenos Aires · Argentina</span>
  </div>
</footer>
`,
})
export class KamakFooterComponent {
  year = new Date().getFullYear();
}
