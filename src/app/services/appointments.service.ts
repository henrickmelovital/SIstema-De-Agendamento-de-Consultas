import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Paciente } from '../models/paciente.model';
import { Appointment } from '../models/appointment.model';
import { Psicologo } from '../models/psicologo.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {
    private appointments: Appointment[] = [];
    private url: string = 'http://localhost:9100/agendamentos';

    constructor(private http: HttpClient, private router: Router) {}

    getAppointments(
        future: boolean,
        patient?: Paciente,
        psico?: Psicologo
    ): Observable<Appointment[]> {
        let query!: HttpParams;

        if (patient !== undefined) {
            query = new HttpParams().append('cpf', patient.cpf).append("future", future);
        } else if (psico !== undefined) {
            query = new HttpParams().append('psicologo_crp', psico.crp).append("future", future);
        }

        return this.http.get<Appointment[]>(this.url, { params: query });
    }

    setAppointments(appointment: Appointment[]): void {
        this.appointments = appointment;
    }

    deleteAppointment(id: number) :void {
        let params = new HttpParams().append('id', id);
        this.http.delete(this.url, {params: params}).subscribe();
    }

    getCurrentAppointments() :Appointment[] {
        return this.appointments;
    }

    addAppoitment(nome: string, sobrenome: string, data_hora: string, local: string, patient: string, psico: number) :Observable<any> {
        let params = new HttpParams().append('nome', nome).append('sobrenome', sobrenome).append('data_hora', data_hora).append('sala', local).append('paciente_id', patient).append('psicologo_crp', psico);
        return this.http.post(this.url, {}, {params: params});
    }

    archive(id: number, motivo: string) :Observable<any>{
        // let params = new HttpParams().append("id", id).append("motivo", motivo);
        return this.http.patch(this.url, { tipo: 'arquivar', id: id, motivo: motivo })
    }
}
