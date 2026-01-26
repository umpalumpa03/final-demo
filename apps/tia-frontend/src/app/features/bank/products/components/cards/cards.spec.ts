import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder text', () => {
    const element = fixture.nativeElement.querySelector('p');
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('cards works!');
  });
});