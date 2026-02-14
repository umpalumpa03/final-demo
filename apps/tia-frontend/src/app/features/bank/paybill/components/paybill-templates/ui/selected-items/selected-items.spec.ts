import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedItems } from './selected-items';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectSelectedTemplates } from '../../../../store/paybill.selectors';
import { TranslateModule } from '@ngx-translate/core';

describe('SelectedItems', () => {
  let component: SelectedItems;
  let fixture: ComponentFixture<SelectedItems>;
  let store: MockStore;

  const mockTemplates = [{ id: 1, name: 'Template 1' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedItems, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedTemplates, value: mockTemplates },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SelectedItems);
    component = fixture.componentInstance;

    store.refreshState();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selectedItems from the store', () => {
    expect(component.selectedItems()).toEqual(mockTemplates);
  });
});
