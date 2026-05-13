import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgCarouselComponent } from '../img-carousel/img-carousel.component';
import { TeamComponent } from '../team/team.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Service {
  id: string;
  title: string;
  description: string;
  images?: string[];
  video?: {
    url: string;
    startTime: number;
  };
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ImgCarouselComponent, TeamComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  constructor(private sanitizer: DomSanitizer) {}

  getEmbedUrl(url: string, startTime: number): SafeResourceUrl {
    const videoId = url.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTime}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  services: Service[] = [
    {
      id: '1',
      title: 'Diseno del proyecto',
      description: 'Disenamos un layout personalizado, adaptado a las necesidades operativas y comerciales. Presentamos planos, renders y visualizaciones que muestran como sera el resultado final antes de comenzar la obra.',
      images: [
        'assets/images/project-design/one.webp',
        'assets/images/project-design/two.webp',
        'assets/images/project-design/three.webp',
        'assets/images/project-design/four.webp',
        'assets/images/project-design/five.webp',
        'assets/images/project-design/six.webp',
      ]
    },
    {
      id: '2',
      title: 'Direccion de obra',
      description: 'Coordinamos todos los gremios necesarios y designamos un arquitecto encargado que estara in situ durante todo el transcurso de la obra.',
      images: [
        'assets/images/construction-site/kamak-developments.webp',
        'assets/images/construction-site/kamak.webp',
      ]
    },
    {
      id: '3',
      title: 'Ejecucion integral',
      description: 'Trabajamos con gremios propios y externos, garantizando la calidad en cada etapa del proceso constructivo y optimizando tiempos de ejecucion.',
      video: {
        url: 'https://www.youtube.com/watch?v=KdkwwQsLFIs',
        startTime: 15
      }
    },
    {
      id: '4',
      title: 'Fabricacion de muebles',
      description: 'Contamos con fabrica propia equipada con tecnologia de produccion automatizada, donde producimos muebles a medida para cada proyecto.',
      video: {
        url: 'assets/images/gastronomic-equipment/fabrication.mp4',
        startTime: 0
      }
    },
    {
      id: '5',
      title: 'Equipamiento gastronomico',
      description: 'Proveemos el equipamiento gastronomico que tu negocio necesita, con soluciones a medida y productos de calidad.',
      images: [
        'assets/images/gastronomic-equipment/big-fridge.webp',
        'assets/images/gastronomic-equipment/fridge.webp',
        'assets/images/gastronomic-equipment/refrigerator.webp',
        'assets/images/gastronomic-equipment/oven.webp',
      ]
    },
    {
      id: '6',
      title: 'Opciones de financiamiento',
      description: 'Ofrecemos diversas opciones de financiamiento para hacer tu obra realidad, adaptandonos a tus posibilidades y facilitando la concrecion de tu proyecto.',
      images: [
        'assets/images/financing/financing.webp',
      ]
    }
  ];
}
