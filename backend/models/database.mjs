import mysql from 'mysql2/promise'
import { Usuario } from '../models/usuario.mjs'
import { Paciente } from '../models/paciente.mjs'
import { Psicologo } from '../models/psicologo.mjs'

export default class Database {

    constructor(host, user, passwd, database){
        this.credentials = {
            host: host,
            user: user,
            password: passwd,
            database: database
        }
    }

    async selectAll(table){
        console.log('Buscandos toda a tabela ' + table)
        let statement = 'SELECT * FROM ' + table
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [], (err, results) => {})
        console.table(resultado)
        console.log('Fim dos resultados')
        conexao.end()
        return resultado
    }

    async insert(table, columns, values){
        console.log("Inserindo os valores " + columns + "\n=> " + values + "\nna tabela " + table)
        let nValues
        for (let i = 1; i <= values.length; i++) {
            if (i === 1) {
                nValues = '?'
            }
            else if (i > 0 && i <= values.length) {
                nValues += ', ?'
            }
        }
        let statement = 'INSERT INTO ' + table + ' ' + columns + ' VALUES (' + nValues + ')'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, values, (err, results) => {})
        conexao.end()
        return resultado
    }

    async login(user, passwd) {
        let statement = "SELECT * FROM Usuario WHERE login = ? and senha = ?"
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [user, passwd], (err, results) => {})
        conexao.end()

        if (resultado.length === 1) {
            let user = new Usuario(
                resultado[0].login,
                resultado[0].senha, 
                resultado[0].id, 
                resultado[0].tipo,
                resultado[0].email,
                resultado[0].dataNascimento,
                resultado[0].nome,
                resultado[0].sobrenome,
                resultado[0].telefone,
                resultado[0].endereco,
                resultado[0].cidade,
                resultado[0].cep)
            return user
        } else {
            return null
        }
    }

    async getAdditionalUserData(table, user_id) {
        let statement = "SELECT * FROM " + table + " WHERE usuario_id = ?"
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [user_id], (err, results) => {})
        conexao.end()

        if (table === "Paciente" && resultado.length === 1) {
            let paciente = new Paciente(
                resultado[0].cpf,
                resultado[0].usuario_id,
                resultado[0].psicologo_crp,
                resultado[0].valorConsulta,
                resultado[0].responsavel
            )
            return paciente
        } else if (table === "Psicologo" && resultado.length === 1) {
            let psicologo = new Psicologo(
                resultado[0].crp,
                resultado[0].cpf,
                resultado[0].usuario_id,
                resultado[0].titulacao,
                resultado[0].especialidade,
                resultado[0].atendimento,
                resultado[0].valor
            )
            return psicologo
        } else {
            return null
        }
    }

    async getNextAppointments(paciente_id, date_now) {
        let statement = "SELECT * FROM Agendamento WHERE paciente_id = ? AND data_hora > ? ORDER BY data_hora ASC LIMIT 6"
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [paciente_id, date_now], (err, results) => {})
        conexao.end()
        return resultado
    }

    async getNextSessions(psicologo_id, date_now) {
        let statement = "SELECT * FROM Agendamento WHERE psicologo_crp = ? AND data_hora > ? ORDER BY data_hora ASC LIMIT 6"
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [psicologo_id, date_now], (err, results) => {})
        conexao.end()
        return resultado
    }

    async updateUserData(table, data) {
        if (table === 'Paciente') {
            let s1 = 'UPDATE Usuario, ' + table
            let s2 = ' SET email = ?, telefone = ?, endereco = ?, cidade = ?, cep = ?, responsavel = ?' 
            let s3 = ' WHERE Usuario.id = ? AND Paciente.usuario_id = ?'
            let statement = s1 + s2 + s3
            let conexao = await mysql.createConnection(this.credentials)
            let [resultado] = await conexao.execute(statement, [
                data.email, data.telefone, data.endereco, data.cidade, data.cep, data.paciente.responsavel, data.id, data.paciente.usuario_id], 
                (err, results) => {})
            conexao.end()
            return resultado
        } else if (table === 'Psicologo') {
            let s1 = 'UPDATE Usuario, ' + table
            let s2 = ' SET email = ?, telefone = ?, endereco = ?, cidade = ?, cep = ?, titulacao = ?, especialidade = ?, atendimento = ?, valor = ?' 
            let s3 = ' WHERE Usuario.id = ? AND Psicologo.usuario_id = ?'
            let statement = s1 + s2 + s3
            let conexao = await mysql.createConnection(this.credentials)
            let [resultado] = await conexao.execute(statement, [
                data.email, data.telefone, data.endereco, data.cidade, data.cep, data.psico.titulacao, data.psico.especialidade, data.psico.atendimento, data.psico.valor, data.id, data.psico.usuario_id], 
                (err, results) => {})
            conexao.end()
            return resultado
        }
    }

    async removeAppointment(id) {
        let statement = 'DELETE FROM Agendamento WHERE id = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [id], (err, results) => {})
        conexao.end()
        return resultado
    }

    async getPsicoInfo(crp) {
        let statement = 'SELECT * FROM Psicologo WHERE crp = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [crp], (err, results) => {})
        conexao.end()
        return resultado[0]
    }

    async getNomePsico(usuario_id) {
        let statement = 'SELECT nome, sobrenome FROM Usuario WHERE id = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [usuario_id], (err, results) => {})
        conexao.end()
        return resultado[0].nome + ' ' + resultado[0].sobrenome
    }

    async getSessions(tipo, id, date) {
        if (tipo === 'paciente') {
            let s1 = 'SELECT Sessao.id as s_id, Sessao.nome as nome, Sessao.sobrenome as sobrenome, '
            let s2 = 'observacoes, notas, Agendamento_id as a_id, Sessao.paciente_id as paciente, '
            let s3 = 'Sessao.psicologo_id as psicologo, Agendamento.data_hora, Agendamento.sala '
            let s4 = 'FROM Sessao LEFT JOIN Agendamento ON Agendamento.id = Sessao.agendamento_id '
            let s5 = 'WHERE arquivada IS NOT TRUE AND Sessao.paciente_id = ? AND data_hora < ? ORDER BY data_hora DESC;'
            let sessao = s1 + s2 + s3 + s4 + s5
            let conexao = await mysql.createConnection(this.credentials)
            let [sessoes] = await conexao.execute(sessao, [id, date], (err, results) => {})
            conexao.end()
            return sessoes
        } else if (tipo === 'psicologo') {
            let s1 = 'SELECT Sessao.id as s_id, Sessao.nome as nome, Sessao.sobrenome as sobrenome, '
            let s2 = 'observacoes, notas, Agendamento_id as a_id, Sessao.paciente_id as paciente, '
            let s3 = 'Sessao.psicologo_id as psicologo, Agendamento.data_hora, Agendamento.sala '
            let s4 = 'FROM Sessao LEFT JOIN Agendamento ON Agendamento.id = Sessao.agendamento_id '
            let s5 = 'WHERE arquivada IS NOT TRUE AND Sessao.psicologo_id = ? AND data_hora < ? ORDER BY data_hora DESC;'
            let sessao = s1 + s2 + s3 + s4 + s5
            let conexao = await mysql.createConnection(this.credentials)
            let [sessoes] = await conexao.execute(sessao, [id, date], (err, results) => {})
            conexao.end()
            return sessoes
        }
    }

    async getUserInfo(crp) {
        let statement = 'SELECT nome, sobrenome, cpf FROM Usuario RIGHT JOIN Paciente ON usuario_id WHERE Usuario.id = Paciente.usuario_id AND Paciente.psicologo_crp = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(statement, [crp], (err, results) => {})
        conexao.end()
        return resultado
    }

    async getPsico() {
        let psicos = 'SELECT nome, sobrenome, crp, titulacao, especialidade, atendimento, valor FROM Usuario, Psicologo WHERE id = usuario_id'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(psicos, [], (err, results) => {})
        conexao.end()
        return resultado
    }

    async getPastAppointments(user, now) {
        let paciente = ''
        let psico = ''
        let resultado = []

        if (user.length === 11) {
            paciente = "SELECT * FROM Agendamento WHERE paciente_id = ? AND data_hora < ? AND arquivada = FALSE ORDER BY data_hora ASC"
            let conexao = await mysql.createConnection(this.credentials)
            resultado = await conexao.execute(paciente, [user, now], (err, results) => {})
            conexao.end()
        }
        else if (user.length === 6) {
            psico = "SELECT * FROM Agendamento WHERE psicologo_crp = ? AND data_hora < ? AND arquivada IS FALSE AND sessao_id IS NULL ORDER BY data_hora ASC"
            let conexao = await mysql.createConnection(this.credentials)
            resultado = await conexao.execute(psico, [user, now], (err, results) => {})
            conexao.end()
        }

        return resultado[0]
    }

    async archive(id, motivo) {
        let arquivar = 'UPDATE Agendamento SET arquivada = TRUE, motivo = ? WHERE id = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(arquivar, [motivo, id], (err, results) => {})
        conexao.end()
        return resultado
    }

    async updateAppointment(sessao, agendamento) {
        let update = 'UPDATE Agendamento SET sessao_id = ? WHERE id = ?'
        let conexao = await mysql.createConnection(this.credentials)
        let [resultado] = await conexao.execute(update, [sessao, agendamento], (err, results) => {})
        conexao.end()
        return resultado
    }
}