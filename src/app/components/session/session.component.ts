import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Psicologo } from 'src/app/models/psicologo.model';
import { Session } from 'src/app/models/session.model';
import { LoginService } from 'src/app/services/login.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
    constructor(private ls: LoginService, private ss: SessionService) {}

    ngOnInit(): void {
        this.ls.setActiveRoute('session')
        console.log("rota ativa: session")
        this.user = this.ls.getUser();
        
        if (this.user.paciente) {
            this.userData = this.user.paciente;
            this.ss.getSessions(this.user.tipo, this.userData?.cpf).subscribe((sessoes) => {
                this.sessoes = sessoes;
            });
        } else if (this.user.psico) {
            this.psicoData = this.user.psico;
            this.ss.getSessions(this.user.tipo, undefined, this.psicoData?.crp).subscribe((sessoes) => {
                console.log(sessoes)
                this.sessoes = sessoes;
            });
        }
    }

    user!: User; 
    userData?: Paciente;
    psicoData?: Psicologo;
    sessoes: Session[] = []; 
    
    ngOnDestroy() :void {
        this.sessoes = [];
    }
}
