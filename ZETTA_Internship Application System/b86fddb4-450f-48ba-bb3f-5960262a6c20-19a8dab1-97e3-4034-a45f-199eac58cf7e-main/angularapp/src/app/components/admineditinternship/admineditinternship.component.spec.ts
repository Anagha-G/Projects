
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdmineditinternshipComponent } from './admineditinternship.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdmineditinternshipComponent', () => {
  let component: AdmineditinternshipComponent;
  let fixture: ComponentFixture<AdmineditinternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule , HttpClientTestingModule , FormsModule],
      declarations: [ AdmineditinternshipComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            snapshot: {
              paramMap: {
                get: () => '123',  
              },
            },
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmineditinternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_admineditinternship_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_edit_internship_heading_in_the_admineditinternship_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Edit Internship');
  }); 

});
