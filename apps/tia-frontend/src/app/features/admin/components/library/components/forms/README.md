1. Contact Form

selector: app-contact-form

Fields:

- name: lib-text-input (text)
- email: lib-text-input (email)
- message: lib-textarea ()
- subscribe: lib-checkboxes
- submit: app-button

Validations:

- name: required, min length 2
- email: required, email format
- message: required, min length 50
- subscribe: required True

2. Registration Form

selector: app-registration-form

Fields:

- First Name: lib-text-input (text)
- Last Name: lib-text-input (text)
- Email: lib-text-input (email)
- Password: lib-text-input (password)
- Confirm Password: lib-text-input (password)
- Country: lib-select
- Birth Date: lib-text-input (date)
- Agree Term: lib-checkboxes
- Create Account: app-button

Validations:

- Firstname: required, min length 2
- Last Name: required, min length 2
- Email: required, email format
- Password: required, min length 8, custom validator 'passwordValidator'
- Confirm Password: required True, custom validator 'passwordMatchValidator' for matching password
- Country: required
- Birth Date: required
- subscribe: required True

3. Settings Form

selector: app-settings-form

Fields:

- Plan Selection: lib-radios
- Email: lib-switches
- Push: lib-switches
- SMS: lib-switches

Validations:

- Plan Selection: required
- Email: required True
- Push: required True
- SMS: required True

4. Inline Form

selector: app-inline-form

Fields:

- Email: lib-text-input

Validations:

- Email: required, email format

5. Form with Validation

selector: app-validation-form

Fields:

- Valid: lib-text-input
- Invalid: lib-text-input
- Warning: lib-text-input

Validations:

- Valid: email format
- Invalid: email format
- Warning: email format

6. Multi-step Form Progress

In this form the reusable component is stepper header - app-stepper-header

this component takes input properties - content and the step

here is usage example

  <div class="multi-step__field">
    <app-stepper-header [content]="stepsConfig" [step]="step" />
  </div>

this is the example what configs we should use

const STEP_FORM = [
  { label: 'From', key: 'from' },
  { label: 'To', key: 'to' },
  { label: 'Amount', key: 'amount' },
];

const MULTI_FORM = {
  name: {
    abel: 'Name',
    required: true,
    placeholder: 'Your Name',
  },
  bio: {
    abel: 'Message',
    required: true,
    placeholder: 'Type your message here...',
  },
} as const;

7.
