.... Badge Component

- კომპონენტი იყენებს `ChangeDetectionStrategy.OnPush`-ს 
- ყველა input არის `readonly` და იყენებს Angular signals-ს
- აიკონების გზები მოთავსებულია `images/svg/badges/` დირექტორიაში
- type -ები მოთავსებულია 
  '@app/shared/lib/primitives/badges/models/badges.models'
- პირველ რიგში აუცილებელია დააიმპორტოთ badge.ts თვქენს კომპონენტში 
import { Badges } from '@app/shared/lib/primitives/badges/badges';

მაგალითები არის ბოლოს სექციეში 

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
  [dismissible]="true"
  dot="online"
  skill="javascript"
  category="technology"
 [disabled]="true"
[selected]="true"
 [hoverable]="true"
 customColor="indigo"
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

ბეიჯის შიგნით გამოსაჩენი ტექსტი. გამოიყენება მხოლოდ მაშინ, როცა არ არის განსაზღვრული `status` , `dot` ,`badge-groups` (რადგან `status` , `dot` ,`badge groups` ავტომატურად აგენერირებენ ტექსტს). 

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

 8) `badge groups` 

 როგორც სტატუს და დოთ badge მუშაობს , მსგავსად გენერირდება badge groupe ებიდან როგორც skill ასევე category badge , თქვენგან მხოლოდ საჭიროა მიუთითო თუ რომელი skill ან category badge  გსურთ ტექსტი და დიზანი  ავტომატურად წამოვა, სურვილისამებრ შეგიძლიათ შეცვალოთ ზომა . (small,medium,large)


 9) `badge states` 

 არსებობს 4 სახის : 

 Default : სტანდარტული ბეიჯი 

 hovered :  [hoverable]="true"  

 disabled :  [disabled]="true" 

 selected :  [selected]="true"  თუ მას მონიშნავთ ბეიჯი ვიზუალურად იქნება სულ მონიშნული. იმისთვის რომ ის დაუბრუნდეს დეფოლტ ქცევას და დინამიურად იმუშაოს, საჭიროა გამოიყენოთ signal ან ფუნქცია `[selected]`-ისთვის, `[clickable]="true"` და `(selectedChange)` event handler-ი, როგორც ნაჩვენებია ქვემოთ:

  <app-badges
text="NIKA"
shape="pill"
size="large"
[selected]="simpleBadgeSelected()"
[clickable]="true"
(selectedChange)="onSimpleBadgeSelectedChange($event)"
>


10) CUSTOM-COLORS 

ფერების შეცვლა თუ დაყენება  ნებისმიერი ბეიჯისთვის არის შესაძლებელი სურვილისამებრ. გამოიყენება `customColor` პარამეტრი:


customColor="indigo"


სულ არის 8 ფერი მოცემული:
- `pink`
- `indigo` 
- `teal` 
- `rose` 
- `cyan` 
- `amber` 
- `lime` 
- `slate` 

**Default:** `undefined` 



  </app-badges>

........................................................................................................................................................
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


### სხვადასხვა skill, category badges 

  <app-badges
    skill="javascript"
    size="large">
  </app-badges>

  <app-badges
    category="technology"
    size="large">
  </app-badges>


### badge states  
```html

 <app-badges 
  text="Disabled" 
  size="medium" 
  shape="rounded"
  [disabled]="true"
></app-badges>


<app-badges
  text="Selected" 
  size="medium" 
  shape="pill"
  [selected]="true"
></app-badges>


 <app-badges
text="NIKA"
shape="pill"
size="large"
[selected]="simpleBadgeSelected()"
[clickable]="true"
(selectedChange)="onSimpleBadgeSelectedChange($event)"
></app-badges>


  <app-badges 
  text="Hover Me" 
  size="medium" 
  shape="rounded"
  [hoverable]="true"
>  </app-badges>

```


#### custom colors 

```html
<app-badges 
  text="Pink Badge" 
  customColor="pink"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Indigo Badge" 
  customColor="indigo"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Teal Badge" 
  customColor="teal"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Rose Badge" 
  customColor="rose"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Cyan Badge" 
  customColor="cyan"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Amber Badge" 
  customColor="amber"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Lime Badge" 
  customColor="lime"
  size="medium" 
  shape="pill"
></app-badges>

<app-badges 
  text="Slate Badge" 
  customColor="slate"
  size="medium" 
  shape="pill"
></app-badges>
```








    