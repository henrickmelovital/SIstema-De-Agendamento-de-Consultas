import { Appointment } from "./appointment.model";

export interface Session {
    id: number;
    nome: string;
    sobrenome: string;
    observacoes: string;
    notas: string;
    agendamento: Appointment;
}