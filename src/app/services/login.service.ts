import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { Paciente } from '../models/paciente.model';
import { Psicologo } from '../models/psicologo.model';
import { PsicoInfo } from '../models/psicoInfo.model';

@Injectable({
    providedIn: 'root',
})
export class LoginService {

    private apiLogin: string = 'http://localhost:9300/login';
    private userDataApi: string = 'http://localhost:9300/user';
    private psicoInfo: string = 'http://localhost:9300/psicoInfo';
    private psicoNome: string = 'http://localhost:9300/nomePsico';
    private selectPsico: string = 'http://localhost:9300/psico';
    private activeRoute: Subject<string> = new Subject<string>();
    private LoguedUser!: User;

    constructor(private http: HttpClient) {}

    findUser(login: string, senha: string): Observable<User> {
        let parametros = new HttpParams()
            .append('login', login)
            .append('senha', senha);
        return this.http.get<User>(this.apiLogin, {
            params: parametros,
        });
    }

    setUser(user: User) :void {
        this.LoguedUser = user;
    }

    getUser() :User {
        return this.LoguedUser;
    }

    getUserData(id: number, tipo: string) :Observable<Paciente> {
        let parametros = new HttpParams().append("tipo", tipo).append("usuario_id", id)
        return this.http.get<Paciente>(this.userDataApi, {params: parametros})
    }

    getPsicoData(id: number, tipo: string) :Observable<Psicologo> {
        let parametros = new HttpParams().append("tipo", tipo).append("usuario_id", id)
        return this.http.get<Psicologo>(this.userDataApi, {params: parametros})
    }

    setActiveRoute(path: string) :void {
        this.activeRoute.next(path);
    }

    getActiveRoute() :Observable<string> {
        return this.activeRoute.asObservable();
    }

    setUserData(patient?: Paciente, psico?: Psicologo) :void {
        if(patient) {
            this.LoguedUser.paciente = patient;
        } else if (psico) {
            this.LoguedUser.psico = psico;
        }
    }

    onLogOut() :void {
        this.LoguedUser.paciente = undefined;
        this.LoguedUser.psico = undefined;
    }

    getPsicoInfo(crp: number) :Observable<Psicologo> {
        let params = new HttpParams().append('crp', crp);
        return this.http.get<Psicologo>(this.psicoInfo, {params: params});
    }

    getNomePsico(id: number) :Observable<string> {
        let params = new HttpParams().append('id', id);
        return this.http.get<string>(this.psicoNome, {params: params});
    }

    selectPsicos() :Observable<PsicoInfo[]> {
        return this.http.get<PsicoInfo[]>(this.selectPsico)
    }
}
