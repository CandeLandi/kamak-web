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
    { title: 'Diseño de proyecto', link: '#servicios' },
    { title: 'Dirección de obra', link: '#servicios' },
    { title: 'Fabricación de muebles', link: '#servicios' },
    { title: 'Equipamiento gastronómico', link: '#servicios' }
  ];

  links = [
    { title: 'Proyectos', link: '#proyectos' },
    { title: 'Servicios', link: '#servicios' },
    { title: 'Proceso', link: '#proceso' },
    { title: 'Contacto', link: '#contacto' }
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
