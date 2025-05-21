import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Part } from '../../repairs/interfaces/part.interface';
import { Repair } from '../../repairs/interfaces/repair.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-presupuesto-page',
  imports: [ReactiveFormsModule],
  templateUrl: './presupuesto-page.component.html',
  styleUrl: './presupuesto-page.component.css'
})
export class PresupuestoPageComponent {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder)

  presupuestoForm = this.fb.group({
    brand: [''],
    model: ['']
    // podrías añadir aquí un FormArray de parts
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

  obtainbrands() {
    this.http.get<any[]>('http://localhost:8080/parts/brands').subscribe((data) => {
      console.log('BRANDS:', data);
      this.brands.set(data);
    });
  }

  obtainmodels(marca: string) {
    this.http.get<any[]>('http://localhost:8080/parts/models', {
      params: { brand: marca }
    }).subscribe((data) => {
      console.log('MODELS:', data);
      this.models.set(data);
    });
  }
  obtainparts(marca: string, modelo: string) {
    this.http.get<any[]>('http://localhost:8080/parts', {
      params: { brand: marca, model: modelo }
    }).subscribe((data) => {
      console.log('PARTS:', data);
      this.parts.set(data);
    });
  }

  onMarcaSeleccionada(marcaId: string) {
    this.brandSelected.set(marcaId);
    this.obtainmodels(marcaId);
  }

  onMarcaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.onMarcaSeleccionada(value);
  }

  onModelSelected(model: string) {
    this.modelSelected.set(model);
    this.obtainparts(this.brandSelected(), model)



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
      parts: this.partsSelected().map(part => ({ id: part.id })),
      duration: 'PT2H30M',
    };

    this.http.post<Repair>('http://localhost:8080/repairs', payload)
      .subscribe({
        next: (resp) => console.log('Reparación creada:', resp),
        error: (err) => console.error('Error al crear reparación:', err)
      });
  }







}
