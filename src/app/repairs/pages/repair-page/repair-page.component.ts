import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { RepairService } from '../../services/repair.service';
import { Repair } from '../../interfaces/repair.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-repair-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './repair-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepairPageComponent {


  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  service = inject(RepairService);
  repairToDeleteId: number | null = null;

  repairId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  repairResource = rxResource<Repair, { id: number }>({
    request: () => ({ id: this.repairId() }),
    loader: ({ request }) => {
      return this.service.loadUserRepair(request.id)
    },
    defaultValue: {} as Repair

  });


  openDeleteModal(id: number) {

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
    this.router.navigateByUrl('reparaciones')
  }




}
