import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeCard } from './customize-card';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CustomizeCard', () => {
  let component: CustomizeCard;
  let fixture: ComponentFixture<CustomizeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeCard, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('iconPath', 'assets/icon.svg');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectionChange with inverted value when toggle is called', () => {
    const spy = vi.spyOn(component.selectionChange, 'emit');
    fixture.componentRef.setInput('isSelected', true);

    component['toggle']();

    expect(spy).toHaveBeenCalledWith(false);
  });
});
