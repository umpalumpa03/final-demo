import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Switches } from './switches';

describe('Switches', () => {
  let component: Switches;
  let fixture: ComponentFixture<Switches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Switches],
    }).compileComponents();

    fixture = TestBed.createComponent(Switches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
