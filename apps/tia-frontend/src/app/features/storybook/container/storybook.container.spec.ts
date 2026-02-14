import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryContainer } from './storybook.container';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { TranslateModule } from '@ngx-translate/core';

describe('LibraryContainer', () => {
  let component: LibraryContainer;
  let fixture: ComponentFixture<LibraryContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryContainer, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectActiveTheme, value: 'ocean-blue' }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
