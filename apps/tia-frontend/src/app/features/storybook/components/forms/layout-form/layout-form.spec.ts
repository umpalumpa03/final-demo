import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutForm } from './layout-form';

describe('LayoutForm', () => {
  let component: LayoutForm;
  let fixture: ComponentFixture<LayoutForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
