import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCardButton } from './add-card-button';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AddCardButton', () => {
  let component: AddCardButton;
  let fixture: ComponentFixture<AddCardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCardButton, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCardButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit clicked on button click', () => {
    const emitSpy = vi.spyOn(component.clicked, 'emit');
    component.handleClick();
    expect(emitSpy).toHaveBeenCalled();
  });
});