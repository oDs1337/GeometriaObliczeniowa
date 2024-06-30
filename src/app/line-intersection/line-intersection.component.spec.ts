import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineIntersectionComponent } from './line-intersection.component';

describe('LineIntersectionComponent', () => {
  let component: LineIntersectionComponent;
  let fixture: ComponentFixture<LineIntersectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineIntersectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineIntersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
