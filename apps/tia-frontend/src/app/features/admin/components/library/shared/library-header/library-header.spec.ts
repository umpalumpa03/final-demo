import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryHeader } from './library-header';

describe('LibraryHeader', () => {
  let component: LibraryHeader;
  let fixture: ComponentFixture<LibraryHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
