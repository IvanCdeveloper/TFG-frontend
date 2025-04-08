import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparacionesPageComponent } from './reparaciones-page.component';

describe('ReparacionesPageComponent', () => {
  let component: ReparacionesPageComponent;
  let fixture: ComponentFixture<ReparacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReparacionesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReparacionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
