import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewinternshipComponent } from './userviewinternship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserviewinternshipComponent', () => {
  let component: UserviewinternshipComponent;
  let fixture: ComponentFixture<UserviewinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserviewinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userviewinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_available_internship_opportunities_heading_in_the_userviewinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Internship Opportunities');
  });
});
