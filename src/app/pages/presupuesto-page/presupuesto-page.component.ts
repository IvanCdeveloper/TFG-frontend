import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Part } from '../../repairs/interfaces/part.interface';
import { Repair } from '../../repairs/interfaces/repair.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RepairService } from '../../repairs/services/repair.service';
import { environment } from '../../environments/environment';
import { CurrencyPipe, NgClass } from '@angular/common';


const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-presupuesto-page',
  imports: [ReactiveFormsModule, CurrencyPipe, NgClass],
  templateUrl: './presupuesto-page.component.html',

})
export class PresupuestoPageComponent {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder)
  private router = inject(Router);
  repairService = inject(RepairService)

  presupuestoForm = this.fb.group({
    brand: [''],
    model: ['']

  });

  brands = signal<any[]>([]);
  models = signal<any[]>([]);
  parts = signal<Part[]>([]);
  partsSelected = signal<Part[]>([]);
  brandSelected = signal('');
  modelSelected = signal('');
  price = computed(() =>
    this.partsSelected().reduce((sum, part) => sum + part.price, 0)
  );

  getBrands() {
    return this.repairService.obtainBrands().subscribe((data) => {
      console.log('MODELS:', data);
      this.brands.set(data);
    });
  }
  getModels(marca: string) {
    this.repairService.obtainModels(marca).subscribe((data) => {
      console.log('PARTS:', data);
      this.models.set(data);
    });
  }
  getParts(marca: string, modelo: string) {
    this.repairService.obtainParts(marca, modelo).subscribe((data) => {
      console.log('BRANDS:', data);
      this.parts.set(data);
    });
  }




  onMarcaSeleccionada(marcaId: string) {
    this.brandSelected.set(marcaId);
    this.getModels(marcaId);
  }

  onMarcaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.onMarcaSeleccionada(value);
  }

  onModelSelected(model: string) {
    this.modelSelected.set(model);
    this.getParts(this.brandSelected(), model)



  }

  onModelChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.onModelSelected(value);
    this.partsSelected.set([])



  }

  onCheckboxChange(event: Event, part: Part) {
    const checked = (event.target as HTMLInputElement).checked;

    this.partsSelected.update(parts => {
      if (checked) {
        // Agregar si no está ya
        if (!parts.some(p => p.id === part.id)) {
          return [...parts, part];
        }
      } else {
        // Quitar si está desmarcado
        return parts.filter(p => p.id !== part.id);
      }
      return parts;
    });
    console.log('Seleccionados:', this.partsSelected);
  }

  isPartSelected(part: Part): boolean {
    return this.partsSelected()?.some(p => p.id === part.id) ?? false;
  }



  onSubmit() {
    const payload = {
      brand: this.brandSelected(),
      model: this.modelSelected(),
      parts: this.partsSelected().map(part => ({ id: part.id }))

    };

    this.http.post<Repair>(`${baseUrl}/repairs`, payload)
      .subscribe({
        next: (resp) => {
          console.log('Reparación creada:', resp)
          this.repairService.loadUserRepairs()
        },
        error: (err) => console.error('Error al crear reparación:', err)
      });



    this.router.navigateByUrl("/reparaciones");
  }






}
