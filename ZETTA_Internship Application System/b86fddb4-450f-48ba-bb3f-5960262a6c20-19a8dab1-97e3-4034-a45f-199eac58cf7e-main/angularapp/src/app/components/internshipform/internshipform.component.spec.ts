import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipformComponent } from './internshipform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InternshipformComponent', () => {
  let component: InternshipformComponent;
  let fixture: ComponentFixture<InternshipformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule , HttpClientTestingModule],
      declarations: [ InternshipformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshipformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_internshipform_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_internship_application_form_heading_in_the_internshipform_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Internship Application Form');
  });
});
