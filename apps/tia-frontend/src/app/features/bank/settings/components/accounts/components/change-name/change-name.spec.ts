import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeName } from './change-name';

describe('ChangeName', () => {
  let component: ChangeName;
  let fixture: ComponentFixture<ChangeName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeName],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
