import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CreateinternshipComponent } from './createinternship.component';
import { InternshipService } from 'src/app/services/internship.service';
import { Router } from '@angular/router';

describe('CreateInternshipComponent', () => {
  let component: CreateinternshipComponent;
  let fixture: ComponentFixture<CreateinternshipComponent>;
  let internshipService: jasmine.SpyObj<InternshipService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const internshipServiceSpy = jasmine.createSpyObj('InternshipService', ['addInternship']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CreateinternshipComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: InternshipService, useValue: internshipServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateinternshipComponent);
    component = fixture.componentInstance;
    internshipService = TestBed.inject(InternshipService) as jasmine.SpyObj<InternshipService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  fit('Frontend_should_create_createinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_create_new_internship_heading_in_the_createinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Internship');
  });

});
