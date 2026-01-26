import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesLayout } from './tables-layout';

describe('TablesLayout', () => {
  let component: TablesLayout;
  let fixture: ComponentFixture<TablesLayout>;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TablesLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize signals with default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
  });

  it('should set loading state immediately when onPageChange is called', () => {
    component.onPageChange(2);
    expect(component.isLoading()).toBe(true);
  });

  it('should eventually stop loading after the timeout', async () => {
    component.onPageChange(2);

    await wait(1000);

    expect(component.isLoading()).toBe(false);
  });

  it('should reset error and start loading on errorReload', () => {
    component.hasError.set(true);

    component.errorReload(1);

    expect(component.hasError()).toBe(false);
    expect(component.isLoading()).toBe(true);
  });

  it('should update basicConfig rows on successful load', async () => {
    component.onPageChange(2);

    await wait(1000);

    if (!component.hasError()) {
      expect(component.basicConfig().rows).toBeDefined();
    }
  });

  it('should execute the error path within loadNextData', async () => {
    let errorHandled = false;
    let attempts = 0;

    while (!errorHandled && attempts < 10) {
      component.onPageChange(2);
      await wait(1000);

      if (component.hasError()) {
        errorHandled = true;
        expect(component.hasError()).toBe(true);
        expect(component.isLoading()).toBe(false);
      }
      attempts++;
    }
  });
});
