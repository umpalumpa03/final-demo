import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryCard } from './category-card';

describe('CategoryCard', () => {
  let component: CategoryCard;
  let fixture: ComponentFixture<CategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCard);
    component = fixture.componentInstance;
  });

  it('should render all card elements correctly', () => {
    fixture.componentRef.setInput('title', 'Utilities');
    fixture.componentRef.setInput('subtitle', 'Electricity, Water, Gas');
    fixture.componentRef.setInput('icon', 'images/svg/cards/lightning.svg');
    fixture.componentRef.setInput('count', 12);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.category-card__title');
    const subtitle = fixture.nativeElement.querySelector('.category-card__subtitle');
    const count = fixture.nativeElement.querySelector('.category-card__count');
    const icon = fixture.nativeElement.querySelector('.category-card__icon img');

    expect(title.textContent).toBe('Utilities');
    expect(subtitle.textContent).toBe('Electricity, Water, Gas');
    expect(count.textContent).toBe('12');
    expect(icon.getAttribute('src')).toBe('images/svg/cards/lightning.svg');
  });

  it('should emit cardClick when clicked', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();

    let emitted = false;
    component.cardClick.subscribe(() => {
      emitted = true;
    });

    const card = fixture.nativeElement.querySelector('.category-card');
    card.click();

    expect(emitted).toBe(true);
  });
});