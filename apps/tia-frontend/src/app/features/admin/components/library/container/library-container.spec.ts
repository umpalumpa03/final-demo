import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryContainer } from './library-container';
import { provideRouter } from '@angular/router';

describe('LibraryContainer', () => {
  let component: LibraryContainer;
  let fixture: ComponentFixture<LibraryContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryContainer],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
