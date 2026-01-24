📚 Angular Form Components Library

📦 Components:

1. Text Input
   Versatile text input with support for multiple input types, icons, and password visibility toggle.

   Selector: lib-text-input

   Supported Types: text, email, password, search, number, date, time, color, file, url, tel

   Standalone Usage:
   <lib-text-input
   [(value)]="username"
   [type]="'email'"
   [config]="{
   label: 'Email Address',
   placeholder: 'Enter your email',
   required: true,
   prefixIcon: 'assets/icons/email.svg',
   helperText: 'We will never share your email'
   }">
   </lib-text-input>

   Reactive forms usage:
   // Component
   searchForm = this.fb.group({
   email: ['', [Validators.required, Validators.email]],
   password: ['', [Validators.required, Validators.minLength(8)]]
   });

<form [formGroup]="searchForm">
  <lib-text-input

    formControlName="email"
    [type]="'email'"
    [config]="{
      label: 'Email',
      successMessage: 'Valid email address'
    }">

  </lib-text-input>

<lib-text-input
formControlName="password"
[type]="'password'"
[config]="{
label: 'Password',
showPasswordToggle: true
}">
</lib-text-input>

</form>

Features

Auto-configured inputs: Each type comes with sensible defaults (icons, placeholders, autocomplete)
Password visibility toggle: Built-in eye icon for password fields
Prefix/suffix icons: Support for custom SVG icons
Character counter: Optional character count display
Auto-validation messages: Automatically displays validation errors from reactive forms

---

2. Textarea

   Auto-resizing textarea with character counter and validation.

   Selector: lib-textarea

   Standalone Usage:

<lib-textarea
[(value)]="description"
[config]="{
label: 'Description',
placeholder: 'Tell us about yourself...',
rows: 3,
showCharacterCount: true,
validation: { maxLength: 500 }
}">
</lib-textarea>

Reactive Forms Usage:

form = this.fb.group({
bio: ['', [Validators.maxLength(500)]]
});

<lib-textarea
formControlName="bio"
[config]="{
label: 'Biography',
resizable: 'vertical',
showCharacterCount: true
}">
</lib-textarea>

interface TextareaConfig {
rows?: number; // Default: 2
resizable?: 'none' | 'both' | 'horizontal' | 'vertical'; // Default: 'none'
showCharacterCount?: boolean; // Default: true
// ... extends InputConfig
}

Features

Auto-resize: Dynamically adjusts height based on content
Character counter: Shows current/max character count
Resize control: Configurable resize behavior

---

3. Select Dropdown
   Custom styled dropdown with keyboard navigation and search support.
   Selector: lib-select
   Standalone Usage:

   countries: SelectOption[] = [
   { label: 'United States', value: 'us' },
   { label: 'Canada', value: 'ca' },
   { label: 'Mexico', value: 'mx', disabled: true }
   ];

   <lib-select
   [(value)]="selectedCountry"
   [options]="countries"
   [config]="{
   label: 'Country',
   placeholder: 'Select your country',
   required: true
   }">
   </lib-select>

   Reactive Forms Usage:

   form = this.fb.group({
   role: ['', Validators.required]
   });

roles: SelectOption[] = [
{ label: 'Admin', value: 'admin' },
{ label: 'Editor', value: 'editor' },
{ label: 'Viewer', value: 'viewer' }
];

<lib-select
formControlName="role"
[options]="roles"
[config]="{
label: 'User Role',
placeholder: 'Choose a role...'
}">
</lib-select>

Features

Disabled options: Individual options can be disabled
Custom styling: Fully styled with CSS variables
Click-outside: Auto-closes when clicking outside
Keyboard accessible: Full keyboard navigation support

4. Radio Groups
   Radio button groups with optional card-style layout and descriptions.
   Selector: lib-radios

   Standalone Usage:

<lib-radios
[(value)]="selectedPlan"
[options]="plans"
[config]="{
label: 'Choose Your Plan',
layout: 'column',
hasBorder: true,
borderColor: '#3b82f6',
borderWidth: '2px'
}">
</lib-radios>

plans: RadioOption[] = [
{
label: 'Basic',
value: 'basic',
description: '$9/month - Perfect for individuals'
},
{
label: 'Pro',
value: 'pro',
description: '$29/month - For growing teams'
},
{
label: 'Enterprise',
value: 'enterprise',
description: 'Custom pricing - For large organizations'
}
];

Reactive Forms Usage:

form = this.fb.group({
subscription: ['basic', Validators.required]
});

<lib-radios
formControlName="subscription"
[options]="plans"
[config]="{
label: 'Subscription Plan',
layout: 'row'
}">
</lib-radios>

interface RadioGroupConfig {
layout?: 'column' | 'row'; // Default: 'column'
hasBorder?: boolean; // Enables card style
borderColor?: string; // Custom border color (HEX/RGB)
borderWidth?: string; // Border width (e.g., '2px')
initialValue?: RadioValue; // Default selected value
}

interface RadioOption {
label: string;
value: string | number | boolean;
description?: string; // Secondary text
disabled?: boolean;
}

Features

Card layout: Optional bordered card style with custom colors
Descriptions: Support for secondary text under labels
Layout options: Vertical or horizontal arrangement
Initial value: Auto-select default option

---

5. Slider (Range)
   Numeric range slider with dynamic fill gradient and value display.
   Selector: lib-slider

Standalone Usage:
<lib-slider
[(value)]="volume"
[config]="{
label: 'Volume',
min: 0,
max: 100,
step: 5,
showValueLabel: true,
valueSuffix: '%'
}">
</lib-slider>

Reactive Forms Usage:
form = this.fb.group({
price: [50, [Validators.min(0), Validators.max(1000)]]
});

<lib-slider
formControlName="price"
[config]="{
label: 'Price Range',
min: 0,
max: 1000,
step: 10,
valueSuffix: '$'
}">
</lib-slider>

Configuration Options:
interface SliderConfig {
min?: number; // Default: 0
max?: number; // Default: 100
step?: number; // Default: 1
showValueLabel?: boolean; // Default: true
valueSuffix?: string; // Default: '' (e.g., '%', 'px', '$')
}

Features

Dynamic fill: Visual gradient shows selected range
Value label: Optional current value display with suffix
Step control: Configure increment granularity

---

6. Switch (Toggle)
   Boolean toggle switch for settings and preferences.
   Selector: lib-switches

Standalone Usage:
<lib-switches
[(checked)]="notificationsEnabled"
[config]="{
label: 'Enable Push Notifications'
}">
</lib-switches>

Reactive Forms Usage:
form = this.fb.group({
newsletter: [false],
terms: [false, Validators.requiredTrue]
});
<lib-switches
formControlName="newsletter"
[config]="{
label: 'Subscribe to newsletter'
}">
</lib-switches>

<lib-switches
formControlName="terms"
[config]="{
label: 'I accept the terms and conditions',
required: true
}">
</lib-switches>

Features

Dual binding: Use [(checked)] for signal binding or formControlName
Accessible: Proper ARIA roles and keyboard support
Smooth animation: CSS transitions for toggle state

---

⚙️ Configuration System
Base Configuration (All Components):

interface InputConfig {
// Identification
id?: string; // Auto-generated if not provided
name?: string;

// Labels & Messages
label?: string;
placeholder?: string;
helperText?: string;
errorMessage?: string; // Override auto-validation messages
successMessage?: string;

// States
disabled?: boolean;
readonly?: boolean;
required?: boolean;

// Styling
variant?: 'outlined' | 'filled' | 'standard';

// Validation
validation?: {
required?: boolean;
minLength?: number;
maxLength?: number;
min?: number;
max?: number;
pattern?: string | RegExp;
email?: boolean;
url?: boolean;
tel?: boolean;
};

// Accessibility
ariaLabel?: string;
autocomplete?: string;

// Features
showCharacterCount?: boolean;
prefixIcon?: string; // Path to SVG icon
suffixIcon?: string;
showPasswordToggle?: boolean;
}

Component-Specific Configs:

Each component extends InputConfig with its own properties (see individual component sections above).
