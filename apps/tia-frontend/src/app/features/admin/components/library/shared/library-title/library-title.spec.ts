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

  it('should render the title text using ta-title selector', () => {
    const titleText = 'Overlay Components';
    fixture.componentRef.setInput('title', titleText);
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.ta-title');
    expect(titleElement.textContent).toContain(titleText);
  });

  it('should render the subtitle text using ta-subtitle selector when provided', () => {
    const subtitleText = 'A collection of modal dialogs and sheets';
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('subtitle', subtitleText);
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.ta-subtitle');
    expect(subtitleElement.textContent).toContain(subtitleText);
  });

  it('should not render the subtitle element when it is not provided', () => {
    fixture.componentRef.setInput('title', 'Title Only');
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('.ta-subtitle');
    expect(subtitleElement).toBeNull();
  });

  it('should update rendering when signal inputs change', () => {
    fixture.componentRef.setInput('title', 'Initial Title');
    fixture.detectChanges();

    let titleElement = fixture.nativeElement.querySelector('.ta-title');
    expect(titleElement.textContent).toContain('Initial Title');

    fixture.componentRef.setInput('title', 'Updated Title');
    fixture.detectChanges();

    titleElement = fixture.nativeElement.querySelector('.ta-title');
    expect(titleElement.textContent).toContain('Updated Title');
  });
});
