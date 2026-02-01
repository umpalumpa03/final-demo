import { Component, inject, OnInit } from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-paybill-templates-container',
  imports: [PaybillTemplates],
  templateUrl: './paybill-templates-container.html',
  styleUrl: './paybill-templates-container.scss',
})
export class PaybillTemplatesContainer implements OnInit {
  public paybillTemplatesService = inject(PaybillTemplatesService);
  public templateGroups!: Observable<any>;
  ngOnInit(): void {
    this.templateGroups = this.paybillTemplatesService.getAllTemplateGroups();
  }
}
