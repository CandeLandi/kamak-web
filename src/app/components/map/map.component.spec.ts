import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MapComponent } from './map.component';
import { GoogleMapsService } from '../../core/services/google-maps.service';
import { ProjectsService } from '../../core/services/projects.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        { provide: 'GOOGLE_MAPS_API_KEY', useValue: 'test-key' },
        { provide: GoogleMapsService, useValue: { loadGoogleMaps: () => Promise.resolve() } },
        { provide: ProjectsService, useValue: { getPublicProjects: () => of([]) } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
