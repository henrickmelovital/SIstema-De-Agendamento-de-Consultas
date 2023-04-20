export class Agendamento {
    constructor(id, nome, sobrenome, data, sala, paciente, psico, sessao, arquivada, motivo) {
        this.id = id
        this.nome = nome,
        this.sobrenome = sobrenome,
        this.data_hora = data
        this.sala = sala
        this.paciente_id = paciente,
        this.psicologo_crp = psico,
        this.sessao_id = sessao,
        this.arquivada = arquivada,
        this.motivo = motivo
    }
}