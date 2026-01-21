import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Colorpalettes } from './colorpalettes';

describe('Colorpalettes', () => {
  let component: Colorpalettes;
  let fixture: ComponentFixture<Colorpalettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colorpalettes],
    }).compileComponents();

    fixture = TestBed.createComponent(Colorpalettes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be a valid component', () => {
    expect(component).toBeTruthy();
  });

  it('should import LibraryTitle component', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-library-title');
    expect(header).toBeTruthy();
  });

  it('should import OceanblueTheme component', () => {
    const compiled = fixture.nativeElement;
    const theme = compiled.querySelector('app-oceanblue-theme');
    expect(theme).toBeTruthy();
  });

  it('should render both header and theme components', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('app-library-title');
    const theme = compiled.querySelector('app-oceanblue-theme');
    expect(header).toBeTruthy();
    expect(theme).toBeTruthy();
  });
});
