export interface Paciente {
    cpf: string;
    usuario_id: number;
    psicologo_crp: number;
    valorConsulta: number;
    responsavel: string | null;
}