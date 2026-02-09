import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedItems } from './selected-items';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectSelectedTemplates } from '../../../../../store/paybill.selectors';

describe('SelectedItems', () => {
  let component: SelectedItems;
  let fixture: ComponentFixture<SelectedItems>;
  let store: MockStore;

  // Define a mock initial state or mock selector result
  const mockTemplates = [{ id: 1, name: 'Template 1' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedItems],
      providers: [
        provideMockStore({
          selectors: [
            // This links the selector to a specific mock value
            { selector: selectSelectedTemplates, value: mockTemplates },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SelectedItems);
    component = fixture.componentInstance;

    // Trigger change detection to initialize signals
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selectedItems from the store', () => {
    // Accessing the signal value
    expect(component.selectedItems()).toEqual(mockTemplates);
  });
});
