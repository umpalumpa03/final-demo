import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizableWidgets } from './customizable-widgets';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { WIDGET_ITEMS } from './config/customizable-widgets.config';
import { TranslateModule } from '@ngx-translate/core';

describe('CustomizableWidgets', () => {
  let component: CustomizableWidgets;
  let fixture: ComponentFixture<CustomizableWidgets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizableWidgets, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(CustomizableWidgets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all widget items', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-widget-card'));
    expect(cards.length).toBe(WIDGET_ITEMS.length);
  });
});
