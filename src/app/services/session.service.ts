import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Paciente } from '../models/paciente.model';
import { Appointment } from '../models/appointment.model';
import { Psicologo } from '../models/psicologo.model';
import { Router } from '@angular/router';
import { Session } from '../models/session.model';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private url: string = 'http://localhost:9200/sessao'

    constructor(private http: HttpClient, private router: Router) {}

    getSessions(tipo: string, paciente?: string, psico?: number): Observable<Session[]> {
        let params!: HttpParams;

        if (paciente) {
            params = new HttpParams().set("tipo", tipo).append("paciente_id", paciente);
        } else if (psico) {
            params = new HttpParams().set("tipo", tipo).append("psicologo_id", psico);
        }

        return this.http.get<Session[]>(this.url, { params: params });
    }

    addSession(session?: Session) :Observable<any> {
        console.log("argumento do addSession", session);
        return this.http.post(this.url, session)
    }
}
