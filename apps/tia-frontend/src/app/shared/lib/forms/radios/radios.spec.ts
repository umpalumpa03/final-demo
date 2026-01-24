import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Radios } from './radios';

describe('Radios', () => {
  let component: Radios;
  let fixture: ComponentFixture<Radios>;
  const mockOptions = [
    { label: 'Opt 1', value: 1 },
    { label: 'Opt 2', value: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Radios],
    }).compileComponents();
    fixture = TestBed.createComponent(Radios);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should update value and emit signal when valid option selected', () => {
    let emittedVal: any;
    component.valueChange.subscribe((v) => (emittedVal = v));

    component['selectOption'](1);

    expect(component['value']()).toBe(1);
    expect(emittedVal).toBe(1);
  });
});
