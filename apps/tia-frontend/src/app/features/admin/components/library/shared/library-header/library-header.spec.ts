import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryHeader } from './library-header';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LibraryHeader', () => {
  let component: LibraryHeader;
  let fixture: ComponentFixture<LibraryHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryHeader],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of color switches', () => {
    const switches = fixture.debugElement.queryAll(By.css('app-color-switch'));
    expect(switches.length).toBe(component.colorConfigs().length);
  });

  it('should update active state when a color is selected', () => {
    const secondItem = component.colorConfigs()[1];
    
    component.setActiveColor(secondItem.color);

    const updatedConfigs = component.colorConfigs();
    const activeItem = updatedConfigs.find(item => item.isActive);

    expect(activeItem?.color).toBe(secondItem.color);
  });
});