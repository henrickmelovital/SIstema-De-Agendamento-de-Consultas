export interface Appointment {
    id: number;
    nome: string;
    sobrenome: string;
    data_hora: string;
    sala: string;
    paciente_id: string;
    sessao_id: number | null;
    psicologo_crp: number;
    arquivada: boolean;
    motivo: string;
}