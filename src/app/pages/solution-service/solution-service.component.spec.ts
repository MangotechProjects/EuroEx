import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionServiceComponent } from './solution-service.component';

describe('SolutionServiceComponent', () => {
  let component: SolutionServiceComponent;
  let fixture: ComponentFixture<SolutionServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
