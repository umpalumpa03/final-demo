import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sent } from './sent';

describe('Sent', () => {
  let component: Sent;
  let fixture: ComponentFixture<Sent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sent],
    }).compileComponents();

    fixture = TestBed.createComponent(Sent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
