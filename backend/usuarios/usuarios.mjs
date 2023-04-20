import express from 'express'
import cors from 'cors'
import axios from 'axios'
import Database from '../models/database.mjs'
import { config } from '../../config.mjs'

const servico = express()
servico.use(express.json())
servico.use(cors())
const porta = config.portas.usuarios
const db = new Database(
    config.database.host, 
    config.database.user, 
    config.database.password, 
    config.database.database)
const msg = `Serviços de usuários rodando na porta ${porta}`
const eventUrl = "http://localhost:9900/eventos"

servico.get('/login', async (req, res) => {
    console.log("query params", req.query)

    let user = await db.login(req.query.login, req.query.senha)

    if (user !== null)  {
        console.log("Usuário localizado:", user)
        // axios.post(eventUrl, { tipo: "Login efetuado", user })
        console.log(msg)
        return res.status(200).send(user)
    }
    else {
        console.log("Nenhum usuário localizado")
        // axios.post(eventUrl, { tipo: "Login" })
        console.log(msg)
        return res.status(200).send(user)
    }
})

servico.get('/user', async (req, res) => {
    console.log("query params", req.query)

    if (req.query.tipo === "paciente") {
        let paciente = await db.getAdditionalUserData("Paciente", req.query.usuario_id)
        console.log(paciente)
        // axios.post(eventUrl, { tipo: "Busca paciente", paciente })
        console.log(msg)
        return res.status(200).send(paciente)
    } else if (req.query.tipo === "psicologo") {
        let psicologo = await db.getAdditionalUserData("Psicologo", req.query.usuario_id)
        console.log(psicologo)
        // axios.post(eventUrl, { tipo: "Busca psicologo", psicologo })
        console.log(msg)
        return res.status(200).send(psicologo)
    } else {
        res.status(400)
    }
})

servico.post('/update', async (req, res) => {
    console.log("Atualizando dados do usuário", req.body)

    if (req.body.tipo === 'paciente') {
        let update = await db.updateUserData('Paciente', req.body)
        return res.status(200).send(update)
    } else if (req.body.tipo === 'psicologo') {
        let update = await db.updateUserData('Psicologo', req.body)
        return res.status(200).send(update)
    }
    return res.status(201).send({msg: "Dados Atualizados com Sucesso"})
})

servico.get('/psicoInfo', async (req, res) => {
    console.log(req.query)
    let resultado = await db.getPsicoInfo(req.query.crp)
    return res.status(200).send(resultado)
})

servico.get('/nomePsico', async (req, res) => {
    console.log(req.query)
    let nome = await db.getNomePsico(req.query.id)
    console.log(nome)
    return res.status(200).json(nome)
})

servico.get('/userInfo', async (req, res) => {
    console.log(req.query)
    let resultado = await db.getUserInfo(req.query.crp)
    return res.status(200).send(resultado)
})

servico.get('/psico', async (req, res) => {
    let psicos = await db.getPsico()
    return res.status(200).send(psicos)
})

servico.post('/add', async (req, res) => {
    console.log(req.body)
    let tabela1 = 'Usuario'
    let colunas1 = '(login, senha, email, dataNascimento, nome, sobrenome, telefone, endereco, cidade, cep, tipo)'
    let valores1 = [req.body.login, req.body.senha, req.body.email, req.body.dataNascimento, req.body.nome, req.body.sobrenome, req.body.telefone, req.body.endereco, req.body.cidade, req.body.cep, req.body.tipo]

    let user = await db.insert(tabela1, colunas1, valores1)
    console.log("Usuário inserido com sucesso", user)

    let tabela2 = "Paciente"
    let colunas2 = '(cpf, usuario_id, psicologo_crp, valorConsulta, responsavel)'
    let valores2 = [req.body.paciente.cpf, user.insertId, req.body.paciente.psicologo_crp, req.body.paciente.valorConsulta, req.body.paciente.responsavel]

    let patient = await db.insert(tabela2, colunas2, valores2)
    console.log("Paciente inserido com sucesso", patient)
    return res.status(201).send({msg: "ok"})
})

servico.listen(porta, () => {
    console.log(msg)
})