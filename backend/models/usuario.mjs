export class Usuario {
    constructor(
        login,
        senha,
        id,
        tipo,
        email,
        dataNascimento,
        nome,
        sobrenome,
        telefone,
        endereco,
        cidade,
        cep
    ){
        this.login = login,
        this.senha = senha,
        this.id = id,
        this.tipo = tipo
        this.email = email,
        this.dataNascimento = dataNascimento,
        this.nome = nome,
        this.sobrenome = sobrenome,
        this.telefone = telefone,
        this.endereco = endereco,
        this.cidade = cidade,
        this.cep = cep
    }
}