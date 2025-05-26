import { Repair } from './../interfaces/repair.interface';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PaginatedResponse } from '../interfaces/paginatedResponse.interface';
import { environment } from '../../environments/environment';
import { empty, Observable } from 'rxjs';
import { Duration } from 'luxon';
import { Part } from '../interfaces/part.interface';



const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class RepairService {

  private http = inject(HttpClient);



  repairs = signal<Repair[]>([]);

  repair = signal<Repair | null>(null);

  constructor() {
    this.loadUserRepairs();
  }
  loadUserRepairs() {
    this.http.get<PaginatedResponse<Repair>>(`${baseUrl}/repairs`).subscribe((resp) => {
      this.repairs.set(resp.content);
      console.log({ resp })
    });
  }
  deleteRepair(id: number) {
    this.http.delete(`${baseUrl}/repairs/${id}`, { responseType: 'text' }).subscribe({
      next: (resp: string) => {
        console.log({ resp });
        this.loadUserRepairs();
      },
      error: (err) => {
        console.error('Error al eliminar reparación:', err);
      }
    });
  }

  obtainBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/parts/brands`);
  }

  obtainModels(marca: string): Observable<any[]> {
    const params = new HttpParams().set('brand', marca);
    return this.http.get<any[]>(`${baseUrl}/parts/models`, { params });
  }

  obtainParts(marca: string, modelo: string): Observable<any[]> {
    const params = new HttpParams().set('brand', marca).set('model', modelo);
    return this.http.get<any[]>(`${baseUrl}/parts`, { params });
  }

  loadUserRepair(id: number): Observable<Repair> {
    return this.http.get<Repair>(`${baseUrl}/repairs/${id}`);

  }

  getPartsNames(parts: Part[] | undefined): string {
    if (!parts || parts.length === 0) return 'Sin piezas';
    return parts.map(p => p.name).join(', ');
  }

  formatDuration(iso: string | null): string {
    if (iso == 'PT0S') {
      return "Por determinar"
    }
    const duration = Duration.fromISO(iso!);

    if (duration.toMillis() < 0) {
      return "Reparado"
    }

    return duration.toFormat("d'd' h'h' ");


  }
















}
