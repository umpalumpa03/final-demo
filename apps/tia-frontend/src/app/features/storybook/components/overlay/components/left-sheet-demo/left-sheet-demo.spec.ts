import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { LeftSheetDemo } from './left-sheet-demo';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LeftSheetDemo', () => {
  let component: LeftSheetDemo;
  let fixture: ComponentFixture<LeftSheetDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSheetDemo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftSheetDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update signal state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });
});
