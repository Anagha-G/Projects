import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshippiechartComponent } from './internshippiechart.component';

describe('InternshippiechartComponent', () => {
  let component: InternshippiechartComponent;
  let fixture: ComponentFixture<InternshippiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshippiechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshippiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
