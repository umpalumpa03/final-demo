import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';
import { BasicCard } from '../../../../../../shared/lib/cards/basic-card/basic-card';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards, BasicCard],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize basicCardData signal with correct values', () => {
    const data = component.basicCardData();
    expect(data.title).toBe('Card Title');
    expect(data.subtitle).toBe('Card description goes here');
    expect(data.content).toBe('This is the main content area of the card. You can put any content here.');
  });

  it('should render page title', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('Cards');
  });

it('should render page description', () => {
  const description = fixture.nativeElement.querySelector('.description');
  expect(description.textContent.trim()).toBe('Card components with various layouts and content types');
});
  it('should render Basic Cards section header', () => {
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent).toBe('Basic Cards');
  });

  it('should render BasicCard component', () => {
    const basicCard = fixture.nativeElement.querySelector('app-basic-card');
    expect(basicCard).toBeTruthy();
  });
});