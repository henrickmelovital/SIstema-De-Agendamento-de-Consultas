import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { Psicologo } from 'src/app/models/psicologo.model';
import { User } from 'src/app/models/user.model';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
    constructor(private ls: LoginService, private aps: AppointmentsService, private router: Router) {}

    ngOnInit(): void {
        this.hoje = new Date()
        this.validador = new Date(this.hoje.setDate(this.hoje.getDate() + 1));
        this.ls.setActiveRoute('appointment');
        console.log('rota ativa: appointment');
        this.user = this.ls.getUser();
        this.appointments = this.aps.getCurrentAppointments();
        if (this.user.paciente) {
            this.ls.getPsicoInfo(this.user.paciente.psicologo_crp).subscribe((data) => {
                // console.log(data)
                this.psico = data;
                this.ls.getNomePsico(data.usuario_id).subscribe((res) => {
                    // console.log(res)
                    this.nomePsico = res;
                })
            })
        }
    }

    user!: User;
    hoje!: Date;
    validador!: Date;
    psico!: Psicologo;
    nomePsico!: string;
    data!: Date; //Moment;
    hora!: Date;
    local!: string;
    online: string = 'Online via Zoom'

    appointments: Appointment[] = [];

    remover(id: number) :void {
        if(this.appointments) {
            this.appointments = this.appointments.filter(appointment => appointment.id !== id);
        }
    }

    excluir(id: number): void {
        if (confirm('Confirmar exclusão do agendamento?')) {
            this.aps.deleteAppointment(id);
            this.remover(id);
        }
    }   

    agendar(form: NgForm, user: User) :void {
        let sala: string = "";

        if (form.value.local === 'presencial') sala = this.psico.atendimento;
        else if (form.value.local === 'online') sala = this.online;

        if (this.user.paciente) {
            this.aps.addAppoitment(user.nome, user.sobrenome, form.value.data.toISOString().substring(0,10) + ' ' + form.value.hora + ':00', sala, this.user.paciente?.cpf, this.psico.crp).subscribe((data) => {
                // console.log(data)
                alert("Seu agendamento foi registrado!");
                form.reset()
                this.router.navigate(['/home'])
            });
        } 
    }
}
