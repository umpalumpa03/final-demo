import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  let component: Tooltip;
  let fixture: ComponentFixture<Tooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tooltip],
    }).compileComponents();

    fixture = TestBed.createComponent(Tooltip);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', 'Tooltip content');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close', () => {
    expect(component.isOpen()).toBe(false);

    component.open();
    expect(component.isOpen()).toBe(true);

    component.close();
    expect(component.isOpen()).toBe(false);
  });
});
