import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplatesContainer } from './paybill-templates-container';
import { TranslateModule } from '@ngx-translate/core';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { of } from 'rxjs';

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let fixture: ComponentFixture<PaybillTemplatesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer, TranslateModule.forRoot()],
      providers: [
        {
          provide: PaybillTemplatesService,
          useValue: { getAllTemplateGroups: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplatesContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
