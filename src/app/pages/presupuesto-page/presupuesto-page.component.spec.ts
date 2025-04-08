import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoPageComponent } from './presupuesto-page.component';

describe('PresupuestoPageComponent', () => {
  let component: PresupuestoPageComponent;
  let fixture: ComponentFixture<PresupuestoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
