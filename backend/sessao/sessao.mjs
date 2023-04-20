import express from 'express'
import cors from 'cors'
import axios from 'axios'
import Database from '../models/database.mjs'
import { config } from '../../config.mjs'
import { Agendamento } from '../models/agendamento.mjs'
import { Sessao } from '../models/sessao.mjs'
import moment from 'moment'

const servico = express()
servico.use(express.json())
servico.use(cors())
const porta = config.portas.sessao
const db = new Database(
    config.database.host, 
    config.database.user, 
    config.database.password, 
    config.database.database)
const msg = `Serviços de sessões rodando na porta ${porta}`
const eventUrl = "http://localhost:9900/eventos"

servico.get('/sessao', async (req, res) => {
    console.log(req.query)
    let hoje = moment().format("YYYY-MM-DD")

    if (req.query.tipo === 'paciente') {
        let resultado = []
        let sessao = await db.getSessions(req.query.tipo, req.query.paciente_id, hoje)
        sessao.forEach(element => {
            console.log(element)
            resultado.push(new Sessao(
                element.s_id,
                element.nome,
                element.sobrenome,
                element.observacoes,
                element.notas,
                new Agendamento(
                    element.a_id,
                    element.nome,
                    element.sobrenome,
                    element.data_hora,
                    element.sala,
                    element.paciente,
                    element.psicologo,
                    element.s_id,
                    false,
                    null)
            ))
        })
        // axios.post(eventUrl, {
        //     tipo: "Busca sessões",
        //     resultado
        // }) 
        console.log(msg)
        return res.status(200).send(resultado)
    } else if (req.query.tipo === 'psicologo') {
        let resultado = []
        let sessao = await db.getSessions(req.query.tipo, req.query.psicologo_id, hoje)
        sessao.forEach(element => {
            // console.log(element)
            resultado.push(new Sessao(
                element.s_id,
                element.nome,
                element.sobrenome,
                element.observacoes,
                element.notas,
                new Agendamento(
                    element.a_id,
                    element.nome,
                    element.sobrenome,
                    element.data_hora,
                    element.sala,
                    element.paciente,
                    element.psicologo,
                    element.s_id,
                    false,
                    null)
            ))
        })
        // axios.post(eventUrl, {
        //     tipo: "Busca sessões",
        //     resultado
        // }) 
        console.log(msg)
        return res.status(200).send(resultado)
    }
})

servico.post('/sessao', async (req, res) => {
    let tabela = 'Sessao'
    let colunas = '(nome, sobrenome, observacoes, notas, agendamento_id, paciente_id, psicologo_id)'
    let valores = [req.body.nome, req.body.sobrenome, req.body.observacoes, req.body.notas, req.body.agendamento.id, req.body.agendamento.paciente_id, req.body.agendamento.psicologo_crp]
    let insert = await db.insert(tabela, colunas, valores)

    let evento = await axios.post(eventUrl, {
        tipo: "update",
        sessao_id: insert.insertId,
        agendamento_id: req.body.agendamento.id,
    })
    console.log("evento", evento.data)
    console.log("sessão", insert)
    console.log(msg)

    res.status(201).send(insert)
})

servico.listen(porta, () => {
    console.log(msg)
})