import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Paciente } from '../models/paciente.model';
import { Psicologo } from '../models/psicologo.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UserDataService {
    constructor(private http: HttpClient, private router: Router) {}

    private url: string = "http://localhost:9300/update"
    private add: string = "http://localhost:9300/add"

    private currentUserData!: User;
    private currentPatientData?: Paciente;
    private currentPsicoData?: Psicologo;
    private newUserData?: User;
    private newPatientData?: Paciente;
    private newPsicoData?: Psicologo;

    setCurrentUserData(user: User, patient?: Paciente, psico?: Psicologo) :void {
        this.currentUserData = user;
        this.currentPatientData = patient;
        this.currentPsicoData = psico;
    }

    setNewUserData(user: User, patient?: Paciente, psico?: Psicologo) :void {
        this.newUserData = user;
        this.newPatientData = patient;
        this.newPsicoData = psico;
    }

    updateUserInfo(user: User, patient?: Paciente, psico?: Psicologo) :void {
        let update!: User;
        
        if (user.tipo === 'paciente' && patient){ 
            update = user;
            update.paciente = patient;
            this.http.post(this.url, update).subscribe((res) => {
                console.log(res);
                alert("Seus dados foram atualizados!");
                this.router.navigate(['/home'])
            });
        } else if (user.tipo === 'psicologo' && psico) {
            update = user;
            update.psico = psico;
            this.http.post(this.url, update).subscribe((res) => {
                console.log(res);
                alert("Seus dados foram atualizados!");
                this.router.navigate(['/home'])
            });
        }
    }

    addUser(user: User) :Observable<any> {
        return this.http.post<any>(this.add, user)
    }
}
