import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ButtonLibraryComponent } from './button-library';
import { ButtonDemoState } from './state/button-demos.state';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('ButtonLibraryComponent', () => {
  let component: ButtonLibraryComponent;
  let fixture: ComponentFixture<ButtonLibraryComponent>;
  let mockState: any;

  beforeEach(async () => {
    mockState = {
      pageInfo: signal({ title: 'Main Title', subtitle: 'Sub Title' }),
      titles: signal({
        variants: 'Variants Section',
        sizes: 'Sizes Section',
        states: 'States Section',
        icons: 'Icons Section',
        interactive: 'Interactive Section',
        groups: 'Groups Section',
        fullWidth: 'Full Width Section'
      }),
      variants: signal([{ type: 'default', label: 'Primary' }]),
      sizes: signal([{ type: 'default', label: 'Medium' }]),
      stateExamples: signal({ disabled: [{ variant: 'default', label: 'Disabled BTN' }] }),
      iconButtons: signal([{ variant: 'default', label: 'Send', icon: 'mail.svg' }]),
      interactiveItems: signal([{ variant: 'outline', label: 'Like', icon: 'heart.svg' }]),
      buttonGroups: signal({ simple: { count: 3, labels: ['A', 'B', 'C'] } }),
      labels: signal({
        defaultLabel: 'Default',
        clickMe: 'Click Me',
        loading: 'Loading...',
        clickToLoad: 'Load More',
        fullWidthBtn: 'Wide',
        fullWidthOutline: 'Wide Outline',
        disabledLabel: 'Disabled'
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ButtonLibraryComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ButtonDemoState, useValue: mockState },
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should render the library title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-library-title')).toBeTruthy();
  });

  it('should render buttons from state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('app-button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});