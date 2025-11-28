import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappliedinternshipComponent } from './userappliedinternship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserappliedinternshipComponent', () => {
  let component: UserappliedinternshipComponent;
  let fixture: ComponentFixture<UserappliedinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserappliedinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappliedinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userappliedinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_applied_internships_heading_in_the_userappliedinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Applied Internships');
  });
});
