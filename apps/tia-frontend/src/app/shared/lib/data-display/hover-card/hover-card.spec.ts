import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoverCard } from './hover-card';

describe('HoverCard', () => {
  let component: HoverCard;
  let fixture: ComponentFixture<HoverCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HoverCard);
    component = fixture.componentInstance;
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
