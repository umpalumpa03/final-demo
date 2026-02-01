import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, QueryList, signal, ViewChildren } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { User } from '../../../store/messaging.state';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-email-chips-input',
  imports: [ReactiveFormsModule, TextInput, Badges],
  templateUrl: './email-chips-input.html',
  styleUrl: './email-chips-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailChipsInput {
  public readonly label = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly searchResults = input<User[]>([]);
  public readonly isSearching = input<boolean>(false);
  public readonly allowMultiple = input<boolean>(false);

  public readonly searchQuery = output<string>();
  public readonly emailSelected = output<User>();
  public readonly emailRemoved = output<string>();
  public readonly invalidCcEmail = output<boolean>();
  public readonly invalidToEmail = output<boolean>();

  public readonly inputControl = new FormControl('');
  public readonly selectedEmails = signal<string[]>([]);
  public readonly highlightedIndex = signal<number>(-1);
  public readonly showDropdown = signal<boolean>(false);

  @ViewChildren('userItem') userItems!: QueryList<ElementRef<HTMLDivElement>>;

  constructor() {
    effect(() => {
      this.searchResults();
      this.highlightedIndex.set(-1);
    });
  }

  public onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();

    this.searchQuery.emit(query);
    this.showDropdown.set(query.length >= 1);

    if (!this.allowMultiple()) {
      this.emailSelected.emit({ email: query } as User);
    }

    const found = this.searchResults().some(u => u.email === query);
    if (this.allowMultiple()) {
      this.invalidCcEmail.emit(!found);
    } else {
      this.invalidToEmail.emit(!found);
    }

    this.highlightedIndex.set(-1);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const users = this.searchResults();
    const value = this.inputControl.value?.trim();

    if (event.key === 'Backspace' && !this.allowMultiple()) {
      this.inputControl.setValue('');
      this.emailSelected.emit({ email: '' } as User);
      this.invalidToEmail.emit(true);
      return;
    }

    if (event.key === 'Backspace' && !this.inputControl.value && this.allowMultiple()) {
      const emails = this.selectedEmails();
      if (emails.length > 0) {
        const lastEmail = emails[emails.length - 1];
        this.removeEmail(lastEmail);
      }
      return;
    }

    if (!users.length && !['Escape'].includes(event.key)) {
      return;
    }

    const currentIndex = this.highlightedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown(users.length);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp(users.length);
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && users[currentIndex]) {
          this.selectUser(users[currentIndex]);
        } else if (value) {
          const found = users.some(u => u.email === value);
          if (!found) {
            this.inputControl.setErrors?.({ notFound: true });
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      default:
        break;
    }
  }

  private navigateDown(totalItems: number): void {
    const currentIndex = this.highlightedIndex();
    const newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
    this.highlightedIndex.set(newIndex);
    this.scrollHighlightedIntoView(newIndex);
  }

  private navigateUp(totalItems: number): void {
    const currentIndex = this.highlightedIndex();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
    this.highlightedIndex.set(newIndex);
    this.scrollHighlightedIntoView(newIndex);
  }

  private scrollHighlightedIntoView(index: number): void {
    setTimeout(() => {
      const items = this.userItems.toArray();
      if (items[index]) {
        items[index].nativeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, 0);
  }

  public selectUser(user: User): void {
    if (this.allowMultiple()) {
      const emails = this.selectedEmails();
      if (!emails.includes(user.email)) {
        this.selectedEmails.set([...emails, user.email]);
        this.inputControl.setValue('');
        this.invalidCcEmail.emit(false);
      }
    } else {
      this.inputControl.setValue(user.email);
      this.invalidToEmail.emit(false);
    }
    this.emailSelected.emit(user);
    this.closeDropdown();
  }

  public clearSelectUser(): void {
    this.emailSelected.emit({} as User);
  }

  public removeEmail(email: string): void {
    this.selectedEmails.set(this.selectedEmails().filter((e) => e !== email));
    this.emailRemoved.emit(email);
  }

  public onUserMouseEnter(index: number): void {
    this.highlightedIndex.set(index);
  }

  private closeDropdown(): void {
    this.showDropdown.set(false);
    this.highlightedIndex.set(-1);
  }


  public onInputBlur(): void {
    setTimeout(() => {
      if (this.showDropdown()) {
        this.closeDropdown();
      }
      const value = this.inputControl.value?.trim();
      if (value && !this.allowMultiple()) {
        const found = this.searchResults().some(u => u.email === value);
        this.invalidToEmail.emit(!found);
        if (!found) {
          this.inputControl.setErrors?.({ notFound: true });
          this.clearSelectUser();
          this.inputControl.setValue('');
        } else {
          this.selectUser(this.searchResults().find(u => u.email === value)!);
        }
      } else if (value && this.allowMultiple()) {
        const found = this.searchResults().some(u => u.email === value);
        this.invalidCcEmail.emit(!found);
        if (!found) {
          this.inputControl.setErrors?.({ notFound: true });
          this.inputControl.setValue('');
        } else {
          this.selectUser(this.searchResults().find(u => u.email === value)!);
        }
      }
    }, 200);
  }

  public reset(): void {
    this.inputControl.setValue('');
    this.selectedEmails.set([]);
    this.closeDropdown();
  }
}
