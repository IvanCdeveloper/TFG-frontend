import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Repair } from '../../repairs/interfaces/repair.interface';
import { PaginatedResponse } from '../../repairs/interfaces/paginatedResponse.interface';
import { environment } from '../../environments/environment';
import { Part } from '../../repairs/interfaces/part.interface';
import { DateTime } from 'luxon';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminService {



  http = inject(HttpClient);

  repairs = signal<Repair[]>([]);

  repair = signal<Repair | null>(null);

  totalRepairs = signal<number>(0);

  totalPages = signal<number>(0);

  constructor() {
    this.loadAllRepairs();
  }

  loadAllRepairs() {
    this.http.get<PaginatedResponse<Repair>>(`${baseUrl}/admin/repairs`).subscribe((resp) => {
      this.repairs.set(resp.content);
      this.totalRepairs.set(resp.totalElements);
      this.totalPages.set(resp.totalPages)
      console.log({ resp })
    });
  }

  loadRepairsFilterAndSorted(filter: string, sortField: string) {
    this.http.get<PaginatedResponse<Repair>>(`${baseUrl}/admin/repairs/sorted`, {
      params: {
        filter: filter,
        sortField: sortField
      }
    }).subscribe((resp) => {
      this.repairs.set(resp.content);
      console.log({ resp })
    });
  }

  createRepair(brand: string, model: string, parts: Part[], endTime: DateTime) {
    const payload = {
      brand,
      model,
      parts,
      endTime
    }

    this.http.post<Repair>(`${baseUrl}/admin/repairs`, payload).subscribe({
      next: (resp) => {
        console.log("reparación creada correctamente", resp)
        this.loadAllRepairs()
      },
      error: (err) => {
        console.log("error: ", err)
      }
    })
  }

  updateRepair(id: number, brand: string, model: string, parts: Part[], endTime: any) {
    const payload = {
      brand,
      model,
      parts,
      endTime
    }

    return this.http.put<any>(`${baseUrl}/admin/repairs/${id}`, payload)

  }

  deleteRepair(id: number) {
    this.http.delete(`${baseUrl}/admin/repairs/${id}`, { responseType: 'text' }).subscribe({
      next: (resp: string) => {
        console.log({ resp });
        this.loadAllRepairs();
      },
      error: (err) => {
        console.error('Error al eliminar reparación:', err);
      }
    });
  }

}
