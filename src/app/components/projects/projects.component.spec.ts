import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { ProjectsComponent } from './projects.component';
import { AuthService } from '../../core/services/auth.service';
import { ProjectsService } from '../../core/services/projects.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            getProjectsByClientId: () => of({ data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 0 } }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            clientIdSignal: signal(null),
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
