import express from 'express'
import cors from 'cors'
import axios from 'axios'
import moment from 'moment';
import Database from '../models/database.mjs'
import { config } from '../../config.mjs'
import { Agendamento } from '../models/agendamento.mjs'

const servico = express()
servico.use(express.json())
servico.use(cors())
const porta = config.portas.agendamento
const db = new Database(
    config.database.host, 
    config.database.user, 
    config.database.password, 
    config.database.database)
const msg = `Serviços de agendamentos rodando na porta ${porta}`
const eventUrl = "http://localhost:9900/eventos"

servico.get("/agendamentos", async (req, res) => {
    console.log(req.query)
    if (req.query.future === 'true') {
        if (req.query.cpf) {
            let resultado = []
            let now = moment().format("YYYY-MM-DD")
            let agendamento = await db.getNextAppointments(req.query.cpf, now)
            agendamento.forEach(ag => {
                resultado.push(new Agendamento(
                    ag.id,
                    ag.nome,
                    ag.sobrenome,
                    ag.data_hora,
                    ag.sala,
                    ag.paciente_id,
                    ag.psicologo_crp,
                    ag.sessao_id,
                    false,
                    ag.motivo
                ))
            });
            // axios.post(eventUrl, {
            //     tipo: "Busca agendamentos",
            //     resultado
            // })
            console.log("data futura paciente")
            res.status(200).send(resultado)
        } else if (req.query.psicologo_crp) {
            let resultado = []
            let now = moment().format("YYYY-MM-DD")
            let agendamento = await db.getNextSessions(req.query.psicologo_crp, now)
            agendamento.forEach(ag => {
                resultado.push(new Agendamento(
                    ag.id,
                    ag.nome,
                    ag.sobrenome,
                    ag.data_hora,
                    ag.sala,
                    ag.paciente_id,
                    ag.psicologo_crp,
                    ag.sessao_id,
                    false,
                    ag.motivo
                ))
            });
            // axios.post(eventUrl, {
            //     tipo: "Busca agendamentos",
            //     resultado
            // })
            console.log("data futura psico")
            res.status(200).send(resultado)
        }
    } else {
        if (req.query.cpf) {
            let resultado = []
            let now = moment().format("YYYY-MM-DD")
            let agendamento = await db.getPastAppointments(req.query.cpf, now)
            agendamento.forEach(ag => {
                resultado.push(new Agendamento(
                    ag.id,
                    ag.nome,
                    ag.sobrenome,
                    ag.data_hora,
                    ag.sala,
                    ag.paciente_id,
                    ag.psicologo_crp,
                    ag.sessao_id,
                    false,
                    ag.motivo
                ))
            });
            // axios.post(eventUrl, {
            //     tipo: "Busca agendamentos",
            //     resultado
            // })
            console.log("data passada paciente")
            res.status(200).send(resultado)
        } else if (req.query.psicologo_crp) {
            let resultado = []
            let now = moment().format("YYYY-MM-DD")
            let agendamento = await db.getPastAppointments(req.query.psicologo_crp, now)
            agendamento.forEach(ag => {
                resultado.push(new Agendamento(
                    ag.id,
                    ag.nome,
                    ag.sobrenome,
                    ag.data_hora,
                    ag.sala,
                    ag.paciente_id,
                    ag.psicologo_crp,
                    ag.sessao_id,
                    false,
                    ag.motivo
                ))
            });
            // axios.post(eventUrl, {
            //     tipo: "Busca agendamentos",
            //     resultado
            // })
            console.log("data passada psico")
            res.status(200).send(resultado)
        }
    }
    
    console.log(msg)
})

servico.post("/agendamentos", async (req, res) => {
    // console.log("Testando", req.query)
    let tabela = 'Agendamento'
    let colunas = '(nome, sobrenome, data_hora, sala, paciente_id, psicologo_crp)'
    let valores = [req.query.nome, req.query.sobrenome, req.query.data_hora, req.query.sala, req.query.paciente_id, req.query.psicologo_crp]
    let insert = await db.insert(tabela, colunas, valores)
    // axios.post(eventUrl, {
    //     tipo: "Novo agendamento",
    //     insert
    // })
    console.log(msg)
    res.status(201).send(insert)
})

servico.delete("/agendamentos", async (req, res) => {
    let id = req.query.id
    let remover = await db.removeAppointment(req.query.id)
    console.log(remover)
    // axios.post(eventUrl, {
    //     tipo: "Agendamento removido",
    //     id
    // })
    res.status(200).send(remover)
})

servico.patch('/agendamentos', async (req, res) => {
    if (req.body.tipo === "arquivar") {
        console.log(req.body)
        let arquivar = await db.archive(req.body.id, req.body.motivo)
        console.log(arquivar)
        console.log(msg)
        return res.status(200).send(arquivar)
    } else if (req.body.tipo === 'update') {
        console.log(req.body)
        let update = await db.updateAppointment(req.body.sessao_id, req.body.agendamento_id)
        console.log(update)
        console.log(msg)
        return res.status(200).send(update)
    }
})

servico.listen(porta, () => {
    console.log(msg)
})