import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { Paciente } from 'src/app/models/paciente.model';
import { User } from 'src/app/models/user.model';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    constructor(private ls: LoginService,
        private aps: AppointmentsService) {}

    ngOnInit(): void {
        this.loading = true;
        this.ls.setActiveRoute("home");
        console.log("rota ativa: home");

        this.loguedUser = this.ls.getUser();

        if (this.loguedUser.tipo === 'paciente') {
            this.ls.getUserData(this.loguedUser.id, this.loguedUser.tipo).subscribe((data) => {
                this.loguedUser.paciente = data;
                this.ls.setUserData(data, undefined);
                this.aps.getAppointments(true, this.loguedUser.paciente, undefined).subscribe((ag) => {
                    this.agendamentosRecentes = ag;
                    this.aps.setAppointments(ag);
                })
            })
        } else if (this.loguedUser.tipo === 'psicologo') {
            this.ls.getPsicoData(this.loguedUser.id, this.loguedUser.tipo).subscribe((data) => {
                this.loguedUser.psico = data;
                this.ls.setUserData(undefined, data);
                this.aps.getAppointments(true, undefined, this.loguedUser.psico).subscribe((ag) => {
                    this.agendamentosRecentes = ag;
                    this.aps.setAppointments(ag);
                })
            })
            this.aps.getAppointments(false, undefined, this.loguedUser.psico).subscribe((past) => {
                this.agendamentosPassados = past;
            })
        }
        this.loading = false;
    }
    loading: boolean = false;

    agendamentosRecentes: Appointment[] = [];
    agendamentosPassados: Appointment[] = [];

    loguedUser!: User;
}
