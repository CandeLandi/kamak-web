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
      title: 'Diseño del proyecto',
      description: 'Diseñamos un layout funcional y personalizado, adaptado a las necesidades operativas y comerciales. Presentamos planos, renders y visualizaciones que permiten entender con claridad cómo será el resultado final antes de comenzar la obra.',
      images: [
        '/assets/images/project-design/one.jpg',
        '/assets/images/project-design/two.jpg',
        '/assets/images/project-design/three.jpg',
        '/assets/images/project-design/four.jpg',
        '/assets/images/project-design/five.jpg',
        '/assets/images/project-design/six.jpg',
      ]
    },
    {
      id: '2',
      title: 'Dirección de obra',
      description: 'Coordinamos todos los gremios necesarios y designamos un arquitecto encargado que estará in situ durante todo el transcurso de la obra.',
      images: [
        '/assets/images/construction-site/kamak-developments.jpg',
        '/assets/images/construction-site/kamak.jpg',
      ]
    },
    {
      id: '3',
      title: 'Ejecución integral',
      description: 'Trabajamos con gremios propios y externos, garantizando la calidad en cada etapa del proceso constructivo y optimizando tiempos de ejecución.',
      video: {
        url: 'https://www.youtube.com/watch?v=KdkwwQsLFIs',
        startTime: 15
      }
    },
    {
      id: '4',
      title: 'Fabricación de muebles',
      description: 'Contamos con fábrica propia equipada con tecnología de producción automatizada, donde producimos muebles a medida para cada proyecto. Garantizamos precisión, calidad y diseño funcional, adaptado a las necesidades y estética de cada espacio.',
      video: {
        url: '/assets/images/gastronomic-equipment/fabrication.mp4',
        startTime: 0
      }
    },
    {
      id: '5',
      title: 'Equipamiento gastronómico',
      description: 'Proveemos el equipamiento gastronómico que tu negocio necesita, con soluciones a medida y productos de calidad.',
      images: [
        '/assets/images/gastronomic-equipment/Diseño sin título (2).png',
        '/assets/images/gastronomic-equipment/Diseño sin título (11).png',
        '/assets/images/gastronomic-equipment/fridge.png',
        '/assets/images/gastronomic-equipment/Diseño sin título (9).png',
      ]
    },
    {
      id: '6',
      title: 'Opciones de financiamiento',
      description: 'Ofrecemos diversas opciones de financiamiento para hacer tu obra realidad, adaptándonos a tus posibilidades y facilitando la concreción de tu proyecto.',
      images: [
        '/assets/images/financing/financing.jpg',
      ]
    }
  ];
}
