import { FirstUpperPipe } from './first-upper-pipe';

describe('FirstUpperPipe', () => {
  let pipe: FirstUpperPipe;

  beforeEach(() => {
    pipe = new FirstUpperPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform the first letter to uppercase', () => {
    expect(pipe.transform('hello')).toBe('Hello');
    expect(pipe.transform('world')).toBe('World');
  });

  it('should return an empty string if input is null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
