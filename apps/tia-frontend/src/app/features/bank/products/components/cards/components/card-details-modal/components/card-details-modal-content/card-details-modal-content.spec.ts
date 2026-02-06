import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDetailsModalContent } from './card-details-modal-content';
import { TranslateModule } from '@ngx-translate/core';

describe('CardDetailsModalContent', () => {
  let component: CardDetailsModalContent;
  let fixture: ComponentFixture<CardDetailsModalContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailsModalContent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDetailsModalContent);
    component = fixture.componentInstance;
  });

  it('should create and emit events', () => {
    const requestOtpSpy = vi.fn();
    const closeSpy = vi.fn();

    component.requestOtpClicked.subscribe(requestOtpSpy);
    component.closeClicked.subscribe(closeSpy);

    fixture.componentRef.setInput('cardName', 'Test Card');
    fixture.componentRef.setInput('cardType', 'VISA');
    fixture.componentRef.setInput('cardCategory', 'CREDIT');
    fixture.componentRef.setInput('currency', 'GEL');
    fixture.componentRef.setInput('status', 'ACTIVE');
    fixture.componentRef.setInput('isActiveStatus', true);
    fixture.componentRef.setInput('formattedBalance', 'GEL 1,000');
    fixture.componentRef.setInput('shouldShowCreditLimit', true);
    fixture.componentRef.setInput('formattedCreditLimit', 'GEL 5,000');
    fixture.detectChanges();

    component['handleRequestOtp']();
    component['handleClose']();

    expect(requestOtpSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });
});