import express from "express";
import cors from "cors";
import axios from "axios";
import { config } from "../../config.mjs";

const servico = express();
servico.use(express.json());
servico.use(cors());
const porta = config.portas.eventos;
const eventos = ["Sessão realizada, atualizar evento"];
const msg = `Serviços de eventos rodando na porta ${porta}`;

servico.post("/eventos", async (req, res) => {
    console.log(req.body)
    const resposta = await axios.patch('http://localhost:9100/agendamentos', req.body)
    console.log(`Agendamento nº ${req.body.agendamento_id} atualizado com sucesso!`);
    console.log(msg)
    return res.status(201).send({mensagem: `Agendamento nº ${req.body.agendamento_id} atualizado com sucesso!`})
});

servico.listen(porta, () => {
    console.log(msg);
});
