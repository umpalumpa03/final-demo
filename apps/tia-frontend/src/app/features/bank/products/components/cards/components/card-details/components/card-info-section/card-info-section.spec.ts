import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardInfoSection } from './card-info-section';

describe('CardInfoSection', () => {
  let component: CardInfoSection;
  let fixture: ComponentFixture<CardInfoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CardInfoSection);
    component = fixture.componentInstance;
  });

  it('should create and render with inputs', () => {
    fixture.componentRef.setInput('cardName', 'My Card');
    fixture.componentRef.setInput('cardType', 'CREDIT');
    fixture.componentRef.setInput('currency', 'GEL');
    fixture.componentRef.setInput('status', 'ACTIVE');
    fixture.componentRef.setInput('isActiveStatus', true);
    fixture.componentRef.setInput('formattedBalance', 'GEL 10,000');
    fixture.componentRef.setInput('shouldShowCreditLimit', true);
    fixture.componentRef.setInput('formattedCreditLimit', 'GEL 5,000');
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});