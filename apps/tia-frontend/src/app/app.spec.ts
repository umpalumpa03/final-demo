import { TestBed } from '@angular/core/testing';
import { App, add, multiply, isEmptyString, capitalize } from './app';

describe('App Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title "tia-frontend"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']).toBe('tia-frontend');
  });

  describe('getGreeting', () => {
    it('should return a greeting with capitalized name', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.getGreeting('john')).toBe('Hello, John!');
    });

    it('should handle already capitalized names', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.getGreeting('Jane')).toBe('Hello, Jane!');
    });

    it('should handle empty string', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.getGreeting('')).toBe('Hello, !');
    });
  });

  describe('calculateSum', () => {
    it('should calculate sum of positive numbers', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.calculateSum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should return 0 for empty array', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.calculateSum([])).toBe(0);
    });

    it('should handle negative numbers', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.calculateSum([-5, 10, -3])).toBe(2);
    });

    it('should handle single number', () => {
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.calculateSum([42])).toBe(42);
    });
  });
});

// describe('Utility Functions', () => {
//   describe('add', () => {
//     it('should add two positive numbers', () => {
//       expect(add(2, 3)).toBe(5);
//     });

//     it('should add negative numbers', () => {
//       expect(add(-5, -10)).toBe(-15);
//     });

//     it('should add positive and negative numbers', () => {
//       expect(add(10, -5)).toBe(5);
//     });

//     it('should handle zero', () => {
//       expect(add(0, 5)).toBe(5);
//       expect(add(5, 0)).toBe(5);
//     });

//     it('should handle decimal numbers', () => {
//       expect(add(1.5, 2.5)).toBe(4);
//     });
//   });

//   describe('multiply', () => {
//     it('should multiply two positive numbers', () => {
//       expect(multiply(3, 4)).toBe(12);
//     });

//     it('should multiply negative numbers', () => {
//       expect(multiply(-2, -5)).toBe(10);
//     });

//     it('should multiply positive and negative numbers', () => {
//       expect(multiply(6, -3)).toBe(-18);
//     });

//     it('should return zero when multiplying by zero', () => {
//       expect(multiply(5, 0)).toBe(0);
//       expect(multiply(0, 5)).toBe(0);
//     });

//     it('should handle decimal numbers', () => {
//       expect(multiply(2.5, 4)).toBe(10);
//     });
//   });

//   describe('isEmptyString', () => {
//     it('should return true for empty string', () => {
//       expect(isEmptyString('')).toBe(true);
//     });

//     it('should return true for whitespace only', () => {
//       expect(isEmptyString('   ')).toBe(true);
//       expect(isEmptyString('\t')).toBe(true);
//       expect(isEmptyString('\n')).toBe(true);
//     });

//     it('should return false for non-empty string', () => {
//       expect(isEmptyString('hello')).toBe(false);
//     });

//     it('should return false for string with content and whitespace', () => {
//       expect(isEmptyString('  hello  ')).toBe(false);
//     });
//   });

//   describe('capitalize', () => {
//     it('should capitalize first letter', () => {
//       expect(capitalize('hello')).toBe('Hello');
//     });

//     it('should not change already capitalized string', () => {
//       expect(capitalize('Hello')).toBe('Hello');
//     });

//     it('should handle single character', () => {
//       expect(capitalize('a')).toBe('A');
//     });

//     it('should return empty string for empty input', () => {
//       expect(capitalize('')).toBe('');
//     });

//     it('should only capitalize first letter', () => {
//       expect(capitalize('hELLO')).toBe('HELLO');
//     });

//     it('should handle strings with spaces', () => {
//       expect(capitalize('hello world')).toBe('Hello world');
//     });
//   });
// });
