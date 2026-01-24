import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PillsNav } from './pills-nav';
import { PillItem } from '../models/pills.model';

describe('PillsNav', () => {
  let fixture: ComponentFixture<PillsNav>;
  let component: PillsNav;
  const pills: PillItem[] = [
    { id: '1', label: 'One' },
    { id: '2', label: 'Two' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillsNav],
    }).compileComponents();
    fixture = TestBed.createComponent(PillsNav);
    component = fixture.componentInstance;
    (component as any).pills = () => pills;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the first pill by default', () => {
    expect(component.selectedPillId()).toBe('1');
  });

  it('should select the pill with initialSelectedId if provided', () => {
    (component as any).initialSelectedId = () => '2';
    component.ngOnInit();
    expect(component.selectedPillId()).toBe('2');
  });

  it('should update selectedPillId and emit pillSelected on selectPill', () => {
    vi.spyOn(component.pillSelected, 'emit');
    component.selectPill(pills[1]);
    expect(component.selectedPillId()).toBe('2');
    expect(component.pillSelected.emit).toHaveBeenCalledWith(pills[1]);
  });

  it('isSelected should return true for selected pill', () => {
    component.selectedPillId.set('2');
    expect(component.isSelected('2')).toBeTruthy();
    expect(component.isSelected('1')).toBeFalsy();
  });
});