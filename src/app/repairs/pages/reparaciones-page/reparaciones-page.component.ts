import { Duration } from 'luxon';
import { Component, computed, inject, signal } from '@angular/core';
import { RepairService } from '../../services/repair.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Part } from '../../interfaces/part.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-reparaciones-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './reparaciones-page.component.html',
})
export class ReparacionesPageComponent {



  authService = inject(AuthService);
  service = inject(RepairService);
  private page = signal(0);
  private size = signal(6);
  repairs = computed(() => this.service.repairs());

  repairToDeleteId: number | null = null;






  openDeleteModal(event: Event, id: number) {
    event.stopPropagation();
    this.repairToDeleteId = id;
    (document.getElementById('confirmDeleteModal') as HTMLDialogElement).showModal();
  }

  cancelDelete() {
    this.repairToDeleteId = null;
  }

  confirmDelete() {
    if (this.repairToDeleteId !== null) {
      this.service.deleteRepair(this.repairToDeleteId);
      this.repairToDeleteId = null;
    }
  }












}
