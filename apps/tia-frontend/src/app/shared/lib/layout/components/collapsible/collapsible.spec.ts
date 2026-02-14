import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Collapsible } from './collapsible';
import { describe, beforeEach, it, expect } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('Collapsible', () => {
  let component: Collapsible;
  let fixture: ComponentFixture<Collapsible>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collapsible, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Collapsible);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('config', {
      title: 'Test Collapsible',
      isOpenDefault: false,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the isOpen signal when toggle is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should set isOpen to true on initialization if isOpenDefault is true', () => {
    const newFixture = TestBed.createComponent(Collapsible);
    const newComponent = newFixture.componentInstance;

    newFixture.componentRef.setInput('config', {
      title: 'Default Open',
      isOpenDefault: true,
    });

    newFixture.detectChanges();
    expect(newComponent.isOpen()).toBe(true);
  });
});
