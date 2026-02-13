import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommandPaletteDemo } from './command-palette-demo';

describe('CommandPaletteDemo', () => {
  let component: CommandPaletteDemo;
  let fixture: ComponentFixture<CommandPaletteDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteDemo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPaletteDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
