import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetCard } from './widget-card';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { WidgetItem } from '../../models/customizable-widgets.model';
import { TranslateModule } from '@ngx-translate/core';

describe('WidgetCard', () => {
  let component: WidgetCard;
  let fixture: ComponentFixture<WidgetCard>;

  const greenItem: WidgetItem = {
    title: 'Recent Transactions',
    description: 'View your latest transactions with details.',
    color: 'green',
  };

  const yellowItem: WidgetItem = {
    title: 'Pro Tip',
    description: '',
    color: 'yellow',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCard, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(WidgetCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('item', greenItem);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display title and description for green item', () => {
    fixture.componentRef.setInput('item', greenItem);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.widget-card__title'));
    const desc = fixture.debugElement.query(By.css('.widget-card__desc'));

    expect(title.nativeElement.textContent).toContain(greenItem.title);
    expect(desc.nativeElement.textContent).toContain(greenItem.description);
  });
});
