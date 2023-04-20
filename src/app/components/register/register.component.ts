import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { Session } from 'src/app/models/session.model';
import { User } from 'src/app/models/user.model';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { LoginService } from 'src/app/services/login.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    constructor(private ls: LoginService, private aps: AppointmentsService, private ss: SessionService) {}

    ngOnInit(): void {
        this.ls.setActiveRoute("register")
        this.user = this.ls.getUser();
        this.aps.getAppointments(false , undefined, this.user.psico).subscribe((data) => {
            this.appointments = data;
            this.appointments.forEach(ag => {
                this.sessao.push({
                    id: 0,
                    nome: ag.nome,
                    sobrenome: ag.sobrenome,
                    observacoes: '',
                    notas: '',
                    agendamento: ag
                })
            })
        });
    }

    user!: User; 
    appointments: Appointment[] = []
    sessao: Session[] = [];

    arquivar(ag: Appointment) :void {
        // console.log(this.appointments.length);
        this.aps.archive(ag.id, ag.motivo).subscribe((data) => {
            // console.log(data);
            alert("Agendamento arquivado com sucesso!");
            // console.log(`Agendamento de ${ag.nome} ${ag.sobrenome} do dia ${ag.data_hora} arquivado!`);
            this.appointments = this.appointments.filter(agendamento => agendamento.id !== ag.id);
            // console.log(this.appointments.length);
        })
    }

    registrar(ag: Appointment) :void {
        let nova = this.sessao.find(session => session.agendamento.id === ag.id);
        this.ss.addSession(nova).subscribe((res) => {
            alert("Sessão registrada com sucesso!");
            // console.log("Sessão:", this.sessao.length, "Agendamento:", this.appointments.length);
            this.appointments = this.appointments.filter(agendamento => agendamento.id !== ag.id);
            this.sessao = this.sessao.filter(session => session.agendamento.id !== ag.id);
            // console.log("Sessão:", this.sessao.length, "Agendamento:", this.appointments.length);
        })
    }
}