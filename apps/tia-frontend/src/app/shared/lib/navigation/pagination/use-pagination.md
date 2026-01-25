<!-- <app-pagination> -->

## 1. თემფლეითში გამოყენება

```html
<app-pagination
  [currentPage]="defaultCurrentPage()"
  [totalPages]="defaultTotalPages()"
  (pageChange)="onDefaultPageChange($event)"
></app-pagination>
```

- `[currentPage]` - ში ვწერთ დეფოლტად რომელ ფეიჯზე იყოს ჩატვირთული
- `[totalPages]` - ში გადავცემთ ფეიჯების რაოდენობას

---

ასევე გვაქვს მეორე პაგინაციის ვარიანტი "..."-ით გამოსაყოფად.

```html
<app-pagination
  [currentPage]="ellipsisCurrentPage()"
  [totalPages]="ellipsisTotalPages()"
  [config]="{
    showEllipsis: true,
    maxVisiblePages: 7,
    previousLabel: 'Previous',
    nextLabel: 'Next'
  }"
  (pageChange)="onEllipsisPageChange($event)"
></app-pagination>
```

კონფიგში გადაეცით ის დატა რაც გინდათ რომ ვიზუალურად ჩანდეს
