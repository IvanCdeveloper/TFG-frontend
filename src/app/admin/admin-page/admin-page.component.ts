

import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { RepairService } from '../../repairs/services/repair.service';
import { Repair } from '../../repairs/interfaces/repair.interface';
import { AdminService } from '../services/admin.service';
import { DateTime, Duration } from 'luxon';
import { Part } from '../../repairs/interfaces/part.interface';




@Component({
  selector: 'app-admin-panel',
  templateUrl: 'admin-page.component.html',
  imports: [CurrencyPipe, NgClass, ReactiveFormsModule]
})
export class AdminPageComponent {

  repairService = inject(RepairService);

  adminService = inject(AdminService)



  fb = inject(FormBuilder);

  constructor(private router: Router,) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/admin') {
        this.adminService.loadAllRepairs();
      }
    });
  }




  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = computed(() => this.adminService.totalPages());

  repairs = computed(() => this.adminService.repairs())
  totalRepairs = computed(() => this.adminService.totalRepairs())
  filtroTexto = signal('');
  filtroMarca = signal('');
  ordenarPor = signal<string>('id');
  mostrarModal = signal(false);
  modoEdicion = signal(false);
  reparacionActual = signal<Partial<Repair>>({});
  repairToDeleteId: any


  price = computed(() =>
    this.partsSelected().reduce((sum, part) => sum + part.price, 0)
  );

  brands = signal<any[]>([]);
  models = signal<any[]>([]);
  parts = signal<Part[]>([]);
  endTime = signal<DateTime>(DateTime.now().plus({ days: 7 }));
  filterBrand = signal('');
  filterModel = signal('');

  partsSelected = signal<Part[]>([]);
  brandSelected = signal('');
  modelSelected = signal('');

  presupuestoForm = this.fb.group({
    brand: [''],
    model: [''],
    endTime: ['']

  });


  getBrands() {
    return this.repairService.obtainBrands().subscribe((data) => {
      console.log('BRANDS:', data);
      this.brands.set(data);
    });
  }
  getModels(marca: string) {
    this.repairService.obtainModels(marca).subscribe((data) => {
      console.log('MODELS:', data);
      this.models.set(data);
    });
  }

  getParts(marca: string, modelo: string) {
    this.repairService.obtainParts(marca, modelo).subscribe((data) => {
      console.log('BRANDS:', data);
      this.parts.set(data);
    });
  }






  onFilterBrandChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.filterBrand.set(value);
    this.adminService.loadRepairsFilterAndSorted(this.filterBrand(), this.ordenarPor())

  }

  onBrandChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.brandSelected.set(value);
    this.getModels(value);

  }

  onModelSelected(model: string) {
    this.modelSelected.set(model);
    this.getParts(this.brandSelected(), model)



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

  onModelChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.onModelSelected(value);
    this.partsSelected.set([])



  }

  onSortFieldSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.ordenarPor.set(value)
    this.adminService.loadRepairsFilterAndSorted(this.filterBrand(), this.ordenarPor())

  }



  reparacionesFiltradas = computed(() => {

    let resultado = [...this.repairs()];

    // Filtrar por texto
    const texto = this.filtroTexto().toLowerCase();
    if (texto) {
      resultado = resultado.filter(r =>
        r.brand.toLowerCase().includes(texto) ||
        r.model.toLowerCase().includes(texto)
      );
    }

    // Filtrar por marca
    const marca = this.filtroMarca();
    if (marca) {
      resultado = resultado.filter(r => r.brand === marca);
    }

    // Ordenar

    type OrdenClave = 'brand' | 'model' | 'price'; // propiedades válidas

    const ordenarPor = this.ordenarPor() as OrdenClave;
    resultado.sort((a, b) => {
      const aVal = a[ordenarPor];
      const bVal = b[ordenarPor];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return (aVal as number) - (bVal as number);
    });

    return resultado;
  });



  ingresoTotal = computed(() => {
    return this.repairs().reduce((sum, r) => sum + r.price, 0).toFixed(2);
  });
  precioPromedio = computed(() => {
    let suma: number = this.repairs().reduce((sum, r) => sum + r.price, 0);

    if (suma == 0) {
      return 0
    }

    return suma / this.repairs().length

  });

  tiempoPromedio = computed(() => {

    const repairs = this.repairs()
    if (repairs.length === 0) {
      return '0 min'
    }

    const totalMs = repairs.reduce((sum, repair) => {
      if (!repair.duration) {
        return sum;
      }
      // Invoca toMillis() para obtener un number
      return sum + Duration.fromISO(repair.duration).toMillis();
    }, 0);

    // Media en ms
    const promedioMs = totalMs / repairs.length;



    return Duration.fromMillis(promedioMs).toFormat("d'd' h'h' m'm'")
  })


  // Métodos para manejar el modal y CRUD
  abrirModalNueva(): void {
    this.modoEdicion.set(false);
    this.reparacionActual.set({});
    this.mostrarModal.set(true);
    this.getBrands();

  }

  editarReparacion(reparacion: Repair): void {
    this.modoEdicion.set(true);
    this.reparacionActual.set({ ...reparacion });

    this.getBrands();

    this.brandSelected.set(reparacion.brand);
    this.presupuestoForm.patchValue({ brand: reparacion.brand });


    this.getModels(reparacion.brand);
    this.modelSelected.set(reparacion.model);
    this.presupuestoForm.patchValue({ model: reparacion.model });


    this.getParts(reparacion.brand, reparacion.model);

    this.partsSelected.set([...reparacion.parts]);


    const fechaISO = reparacion.endTime!;
    const dt = DateTime.fromISO(fechaISO);
    this.endTime.set(dt);

    const isoSinSegundos = dt.toISO({ suppressMilliseconds: true, includeOffset: false });

    this.presupuestoForm.patchValue({ endTime: isoSinSegundos });


    this.mostrarModal.set(true);

  }







  saveEndTime(event: Event) {
    const dateTimeElement = event.target as HTMLInputElement;
    const value = dateTimeElement.value;

    this.endTime.set(DateTime.fromISO(value));
  }



  guardarReparacion(): void {


    const brand = this.presupuestoForm.value.brand ?? ""
    const model = this.presupuestoForm.value.model ?? ""
    const endTime = DateTime.fromISO(this.presupuestoForm.value.endTime!)

    const parts = this.partsSelected();

    if (this.modoEdicion()) {
      // Llamada a actualizar la reparación existente
      const actual = this.reparacionActual() as Repair;
      this.adminService.updateRepair(
        actual.id,
        brand, model, parts, endTime
      ).subscribe(() => {
        this.adminService.loadAllRepairs();
        this.cerrarModal();
      });
    } else {
      // Llamada a crear nueva reparación
      this.adminService.createRepair(this.brandSelected(), this.modelSelected(), this.partsSelected(), this.endTime())
      this.cerrarModal();
    }
    console.log(this.partsSelected())
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.reparacionActual.set({});
    this.brandSelected.set('');
    this.modelSelected.set('');
    this.partsSelected.set([]);
    this.endTime.set(DateTime.now().plus({ days: 7 }));
    // Limpiamos el formulario (por si volvemos a abrir en modo creación)
    this.presupuestoForm.reset({
      brand: '',
      model: '',
      endTime: ''
    });
  }

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
      this.adminService.deleteRepair(this.repairToDeleteId);
      this.repairToDeleteId = null;
    }
  }









}
