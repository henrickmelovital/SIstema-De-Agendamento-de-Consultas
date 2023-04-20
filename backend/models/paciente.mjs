export class Paciente {
    constructor (
        cpf,
        usuario_id,
        psicologo_crp,
        valorConsulta,
        responsavel
    ){
        this.usuario_id = usuario_id
        this.psicologo_crp = psicologo_crp
        this.cpf = cpf
        this.valorConsulta = valorConsulta
        this.responsavel = responsavel
    }
}