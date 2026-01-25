Angular Input Components Library

Components:

1. Text Input

   Selector: lib-text-input

   Supported Types: text | email | password | search | number | date | time | color | file | url | tel

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

   Validation states: Error, Warning, Success

   <lib-text-input
   [state]="'warning'"
   [config]="{
   label: 'Password',
   warningMessage: 'This password is weak, but acceptable'
   }">
   </lib-text-input>

   Reactive forms usage:

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

   Config:
   label: string (Input Title).
   placeholder: string.
   helperText: string (Permanent helper text below the input).
   errorMessage: string (Text which appears when state is 'error')
   warningMessage: string (Text which appears when state is 'warning')
   successMessage: string (Text which appears when state is 'success')
   required: boolean (Makes input required and adds \* on top of it)
   disabled: boolean (Shuts down the input field)
   readonly: boolean (Makes the input field only readable)
   prefixIcon: string (Can change SVG icon with yours, with a path)
   labelIconUrl: string (Can give Icon to a label as well, left of the label it will show)

---

2. Textarea

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
   }

---

3. Select Dropdown

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

4. Radio Groups

   Selector: lib-radios

   Standalone Usage:

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
   description: 'Custom pricing'
   }
   ];

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
   hasBorder?: boolean; // Enables borders
   borderColor?: string; // Custom border color (HEX/RGB)
   borderWidth?: string; // Border width (e.g., '2px')
   initialValue?: RadioValue; // Default selected value
   }

   interface RadioOption {
   label: string;
   value: string | number | boolean;
   description?: string; // Secondary text (e.g., '$9.90/month')
   disabled?: boolean;
   }

---

5. Slider (Range)

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

---

6. Switch (Toggle)

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
   [config]="{ label: 'Subscribe to newsletter' }">
   </lib-switches>

   <lib-switches
   formControlName="terms"
   [config]="{
   label: 'I accept the terms and conditions',
   required: true
   }">
   </lib-switches>

---

7. OTP

   Selector: <lib-otp>

   Standalone Usage:
   <lib-otp
   [(value)]="otpCode"
   [config]="{
   label: 'Enter Verification Code',
   length: 6,
   inputType: 'number',
   placeholder: '-'
   }">
   </lib-otp>

   Reactive Forms Usage:

   form = this.fb.group({
   verificationCode: ['', [Validators.required, Validators.minLength(6)]]
   });

   <lib-otp
   formControlName="verificationCode"
   [config]="{
   label: 'Security Code',
   length: 6,
   inputType: 'number',
   required: true
   }">
   </lib-otp>

---

Configuration System
Base Configuration (All Components):

interface InputConfig {
id?: string;
name?: string;

label?: string;
placeholder?: string;
helperText?: string;
errorMessage?: string;
successMessage?: string;

disabled?: boolean;
readonly?: boolean;
required?: boolean;

variant?: 'outlined' | 'filled' | 'standard';

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

ariaLabel?: string;
autocomplete?: string;

showCharacterCount?: boolean;
prefixIcon?: string;
suffixIcon?: string;
showPasswordToggle?: boolean;
}
