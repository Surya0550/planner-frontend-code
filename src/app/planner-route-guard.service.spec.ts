import { TestBed } from '@angular/core/testing';

import { PlannerRouteGuardService } from './planner-route-guard.service';

describe('PlannerRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlannerRouteGuardService = TestBed.get(PlannerRouteGuardService);
    expect(service).toBeTruthy();
  });
});
