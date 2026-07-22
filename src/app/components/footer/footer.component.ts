import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trackWhatsAppClick } from '../../pages/home/site-interactions';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  // Evento GA4 `clic_whatsapp` — no bloquea la navegación (gtag es async).
  trackWa(origen: string): void { trackWhatsAppClick(origen); }

  services = [
    { title: 'Proyectos y Renders', link: '#' },
    { title: 'Soluciones Integrales', link: '#' },
    { title: 'Horario Continuo', link: '#' },
    { title: 'Planos Eléctricos', link: '#' }
  ];

  links = [
    { title: 'Inicio', link: '#' },
    { title: 'Servicios', link: '#servicios' },
    { title: 'Proyectos', link: '#proyectos' }
  ];

  contactInfo = {
    sales: {
      phone: '2262559474',
      email: 'direccion@kamak.com.ar'
    },
    admin: {
      phone: '2262223704',
      email: 'administracion@kamak.com.ar'
    },
    location: 'Avenida 42 N°3703 Necochea, Buenos Aires, Argentina.'
  };
}
