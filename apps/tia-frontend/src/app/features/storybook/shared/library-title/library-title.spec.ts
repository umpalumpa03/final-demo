import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryTitle } from './library-title';
import { expect, describe, it, beforeEach } from 'vitest';

describe('LibraryTitle', () => {
  let component: LibraryTitle;
  let fixture: ComponentFixture<LibraryTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryTitle);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('title', 'Test Header');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
