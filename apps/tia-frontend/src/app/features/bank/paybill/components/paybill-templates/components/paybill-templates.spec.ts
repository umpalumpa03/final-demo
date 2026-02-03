import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PaybillTemplates', () => {
  let component: PaybillTemplates;
  let fixture: ComponentFixture<PaybillTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplates, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('templateGroups', []);
    fixture.componentRef.setInput('templates', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
