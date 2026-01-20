import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-basic-alerts',
  imports: [],
  templateUrl: './basic-alerts.html',
  styleUrl: './basic-alerts.scss',
})
export class BasicAlerts {
  alertType = input<'default' | 'error'>('default');
  alertTitle = input<string>('Default Alert');
  alertMessage = input<string>('This is a default alert with important information.');

 effectiveTitle = computed(() => {
    if(this.alertType() === 'error' && this.alertTitle() === 'Default Alert') {
      return 'Error Alert';
    }
    return this.alertTitle();
  });

  effectiveMessage = computed(() => { 
    if(this.alertType() === 'error' && this.alertMessage() === 'This is a default alert with important information.') {
      return 'This is an error alert with important information.';
    }
    return this.alertMessage();
  });
}
