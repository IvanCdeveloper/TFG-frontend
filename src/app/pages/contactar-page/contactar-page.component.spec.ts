import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactarPageComponent } from './contactar-page.component';

describe('ContactarPageComponent', () => {
  let component: ContactarPageComponent;
  let fixture: ComponentFixture<ContactarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
