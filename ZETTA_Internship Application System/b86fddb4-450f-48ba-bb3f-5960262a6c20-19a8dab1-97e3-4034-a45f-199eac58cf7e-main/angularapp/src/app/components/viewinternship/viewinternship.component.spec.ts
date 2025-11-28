import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewinternshipComponent } from './viewinternship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewinternshipComponent', () => {
  let component: ViewinternshipComponent;
  let fixture: ComponentFixture<ViewinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ ViewinternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_viewinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Internship_Listings_heading_in_the_viewinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Internship Listings');
  });
});
