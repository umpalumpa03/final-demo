.... Badge Component

- კომპონენტი იყენებს `ChangeDetectionStrategy.OnPush`-ს 
- ყველა input არის `readonly` და იყენებს Angular signals-ს
- აიკონების გზები მოთავსებულია `images/svg/badges/` დირექტორიაში

` მიმოხილვა`



**badge component- ის გამოყენება**

```html
<app-badges
  variant="default"
  text="Custom Text"
  status="active"
  size="medium"
  shape="pill"
  label="Label"
  dismissible="true"
  dot="online"
 > </app-badges>

```

## Input პარამეტრები

1) `variant` (BadgeVariant)

 ხელმისაწვდომი ვარიანტები:
 
- `'default'` - ლურჯი ფონი, თეთრი ტექსტი
- `'secondary'` - ნაცრისფერი ფონი, ლურჯი ტექსტი, ლურჯი border
- `'destructive'` - წითელი ფონი, თეთრი ტექსტი
- `'outline'` - თეთრი ფონი, ლურჯი ტექსტი, ლურჯი border



2) `text` (string)

ბეიჯის შიგნით გამოსაჩენი ტექსტი. გამოიყენება მხოლოდ მაშინ, როცა არ არის განსაზღვრული `status` ან `dot` (რადგან `status` და `dot` ავტომატურად აგენერირებენ ტექსტს). 

**Default:** `''`

**შენიშვნა**: `text`-ს შეგიძლიათ გამოიყენოთ `label`-თან ერთად - `label` გამოჩნდება badge-ის წინ, `text` კი badge-ის შიგნით. 



3) `status` (BadgeStatus)
ბეიჯის სტატუსი, რომელიც ავტომატურად აყენებს ფერს, აიკონს და ტექსტს. ხელმისაწვდომი სტატუსები:
- `active` - მწვანე ფონი, "Active" ტექსტი
- `pending` - ყვითელი ფონი, "Pending" ტექსტი
- `inactive` - წითელი ფონი, "Inactive" ტექსტი
- `in-progress` - ლურჯი ფონი, "In Progress" ტექსტი
- `featured` - იისფერი ფონი, "Featured" ტექსტი
- `premium`    - ნარინჯისფერი ფონი, "Premium" ტექსტი



4) `size` (BadgeSize)
ბეიჯის ზომა. ხელმისაწვდომი ზომები:
- `small` 
- `medium` 
- `large` 

Default: `small`

5) `shape` (BadgeShape)
ბეიჯის ფორმა:
- `default` - კვადრატული კუთხეები (border-radius: 0) 
- `rounded` - მომრგვალებული კუთხეები (border-radius: 0.9rem)
- `pill` - სრულად მომრგვალებული (border-radius: 9999px)

**Default**: `'pill'` თუ არის `status` ან `dot`, სხვა ყველა შემთხვევაში  `default`

6) `label` (string)

ბეიჯის გარეთ, მის წინ გამოსაჩენი ლეიბლი. გამოიყენება როცა გჭირდებათ დამატებითი ტექსტი badge-ის წინ (მაგალითად, "Notifications: 99" სადაც "Notifications" არის label და "99" არის text badge-ის შიგნით).

**Default:** `''`

**შენიშვნა**: `label`-ს შეგიძლიათ გამოიყენოთ `text`-თან, `status`-თან ან `dot`-თან ერთად.

### `dismissible` (boolean)
განსაზღვრავს, შეიძლება თუ არა ბეიჯის დახურვა. თუ `true`, ბეიჯზე გამოჩნდება დახურვის ღილაკი.

**Default:** `false`

7) `dot` (BadgeDotType)

ბეიჯზე გამოსაჩენი წერტილის (dot) ტიპი. ხელმისაწვდომი ტიპები:

- `'online'` - მწვანე წერტილი, "Online" ტექსტი, ლურჯი ფონი
- `'away'` - ყვითელი წერტილი, "Away" ტექსტი, ღია ლურჯი ფონი
- `'offline'` - წითელი წერტილი, "Offline" ტექსტი, თეთრი ფონი
- `'live'` - ლურჯი წერტილი, "Live" ტექსტი, ლურჯი ფონი

**Default:** `undefined`


**აიკონის გამოჩენა**: აიკონი ავტომატურად გამოჩნდება, როცა არის განსაზღვრული `status`.

 **წერტილის (dot) გამოჩენა**: წერტილი გამოჩნდება, როცა არის განსაზღვრული `dot`. წერტილის ფერი განისაზღვრება `dotColorMap`-ის მიხედვით.


................................................ მაგალითები ................................................................

### მარტივი ბეიჯი
```html
<app-badges text="New" />
```

### სტატუსით
```html
<app-badges status="active" />  
 
 მოცემულ შემთხვევაში არ არის საჭირო text ჩაწერა ავტომატურად დააგენერირებს active აიკონს ,ტექტს და ფერს. შეგიძლიათ ზომა გადაცეთ 
```

### წერტილით
```html
<app-badges dot="online" />
<app-badges dot="away">
<app-badges dot="offline" />
<app-badges dot="Live ">

 სტატუსის მსგავსად მუშაობს dot , ავტომატურად მოყვება შესაბამისი წერტილი ფერი და ტექსტი . ზომის შეცვლა არის შესაძლებელი  
```

### დახურვადი ბეიჯი

**მარტივი დახურვა** (დამატებითი ლოგიკის გარეშე):
```html
<app-badges 
  text="Notification" 
  dismissible="true"
/>
```



### ლეიბლი და ტექსტი ერთად 
```html
  <app-badges
  label="notifications"
   text="99"
   variant="secondary"
   size="small"
   shape="pill"
>
</app-badges>
```

### სხვადასხვა ზომა და ფორმა
```html
<app-badges 
  text="Small Pill" 
  size="small" 
  shape="pill" 
/>

<app-badges 
  text="Large Rounded" 
  size="large" 
  shape="rounded" 
/>
```











    