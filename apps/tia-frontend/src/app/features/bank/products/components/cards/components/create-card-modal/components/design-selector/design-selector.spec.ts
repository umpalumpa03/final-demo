import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignSelector } from './design-selector';

describe('DesignSelector', () => {
  let component: DesignSelector;
  let fixture: ComponentFixture<DesignSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
