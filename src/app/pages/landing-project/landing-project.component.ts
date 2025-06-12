import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-landing-project',
  standalone: true,
  imports: [FooterComponent, RouterModule],
  templateUrl: './landing-project.component.html',
  styleUrls: ['./landing-project.component.scss']
})
export class LandingProjectComponent implements OnInit {
  project = {
    title: 'PUMA CQ-Necochea',
    description: 'Renovación completa de estación de servicio',
    location: 'Necochea, Buenos Aires',
    client: 'PUMA Energy',
    area: '380 m²',
    duration: '45 días',
    startDate: '15/02/2024',
    endDate: '30/03/2024',
    longDescription: 'Renovación completa de estación de servicio con tienda de conveniencia integrada. Implementación de nuevos estándares de marca y mejora de la experiencia del cliente. El proyecto incluyó la renovación de la fachada, la tienda interior y las áreas de servicio.',
    challenge: 'El principal desafío fue mantener la estación operativa durante la renovación, minimizando el impacto en las ventas diarias y asegurando la seguridad de los clientes.',
    solution: 'Implementamos un plan de trabajo por fases, trabajando 24/7 en áreas específicas mientras manteníamos otras operativas. Utilizamos barreras temporales y señalización clara para guiar a los clientes.',
    gallery: [
      '/assets/images/proyecto1-1.jpg',
      '/assets/images/proyecto1-2.jpg',
      '/assets/images/proyecto1-3.jpg',
      '/assets/images/proyecto1-4.jpg',
      '/assets/images/proyecto1-5.jpg',
      '/assets/images/proyecto1-6.jpg',
    ],
    videos: [
      'https://www.youtube.com/embed/C_zFhWdM4ic',
      'https://www.youtube.com/embed/2Vv-BfVoq4g',
      'https://www.youtube.com/embed/3JZ_D3ELwOQ'
    ]
  };
  showAllImages = false;
  initialImageCount = 6;

  constructor(private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  get displayedGallery() {
    return this.showAllImages ? this.project.gallery : this.project.gallery.slice(0, this.initialImageCount);
  }

  get hasMoreImages() {
    return this.project.gallery.length > this.initialImageCount;
  }

  openImageModal(index: number) {
    // Lógica para abrir modal de imagen (mockup)
    alert('Abrir imagen modal: ' + index);
  }

  generatePlaceholderUrl(text: string): string {
    // Devuelve una URL de placeholder con texto (mockup)
    return `https://via.placeholder.com/600x400?text=${encodeURIComponent(text)}`;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
