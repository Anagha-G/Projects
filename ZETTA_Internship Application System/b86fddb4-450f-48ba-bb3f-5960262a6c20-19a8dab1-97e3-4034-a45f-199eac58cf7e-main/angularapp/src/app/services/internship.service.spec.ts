
import { TestBed } from '@angular/core/testing';

import { InternshipService } from './internship.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InternshipService', () => {
  let service: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(InternshipService);
  });

  fit('Frontend_should_create_internship_service', () => {
    expect(service).toBeTruthy();
  });
});
