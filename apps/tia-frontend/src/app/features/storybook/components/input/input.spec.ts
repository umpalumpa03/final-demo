import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';
import { TranslateModule } from '@ngx-translate/core';
import { InputDemoState } from './state/input-demos.state';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input, TranslateModule.forRoot()],
      providers: [InputDemoState],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
