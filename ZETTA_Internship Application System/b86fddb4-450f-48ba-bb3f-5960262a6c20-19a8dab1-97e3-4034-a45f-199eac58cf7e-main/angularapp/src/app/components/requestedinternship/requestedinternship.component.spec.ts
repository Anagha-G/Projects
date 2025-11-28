import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestedinternshipComponent } from './requestedinternship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestedinternshipComponent', () => {
  let component: RequestedinternshipComponent;
  let fixture: ComponentFixture<RequestedinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ RequestedinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_requestedinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_internship_applications_for_approval_heading_in_the_requestedinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Internship Applications for Approval');
  });
});
