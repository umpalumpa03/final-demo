import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PillsComponent } from './pills-component';
import { PillItem } from '@tia/shared/lib/navigation/models/pills.model';

describe('PillsComponent', () => {
  let fixture: ComponentFixture<PillsComponent>;
  let component: PillsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedPill on onPillSelected', () => {
    const pill: PillItem = { id: 'active', label: 'Active' };
    component.onPillSelected(pill);
    expect(component.selectedPill()).toEqual(pill);
  });
});