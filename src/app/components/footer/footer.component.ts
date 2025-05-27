import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
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
      email: 'kamakdesarrollos@gmail.com'
    },
    admin: {
      phone: '2262223704',
      email: 'admkamakdesarrollos@gmail.com'
    },
    location: 'Avenida 42 N°3703 Necochea, Buenos Aires, Argentina.'
  };
}
