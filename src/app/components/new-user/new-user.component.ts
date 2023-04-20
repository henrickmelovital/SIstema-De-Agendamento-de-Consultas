import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PsicoInfo } from 'src/app/models/psicoInfo.model';
import { Psicologo } from 'src/app/models/psicologo.model';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css'],
})
export class NewUserComponent implements OnInit {

     constructor(private ls: LoginService, private ud: UserDataService, private router: Router) {}

    ngOnInit(): void {
        this.ls.setActiveRoute('newuser');
        console.log("rota ativa: newuser");
        this.hoje = new Date();
        this.ls.selectPsicos().subscribe((psicos) => {
            this.psicos = psicos;
        })
    }

    hoje!: Date;
    dataNascimento!: string;
    newUser: User = {
        login: '',
        senha: '',
        id: 0,
        email: '',
        nome: '',
        sobrenome: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        cep: '',
        tipo: 'paciente',
        paciente: {
            cpf: '',
            psicologo_crp: 0,
            usuario_id: 0,
            valorConsulta: 0,
            responsavel: '',
        },
    };
    psicos: PsicoInfo[] = []
    selection?: PsicoInfo;
    matSelect!: string;

    selectedPsico(value: string) :void {
        if (value !== undefined) {
            let valor: number = Number(value);
            this.psicos.filter(element => {
                if(valor === element.crp)
                this.selection = element;
            })
        } else {
            this.selection = undefined;
        }
    }

    dateConversion(value: Date) :void {
        this.dataNascimento = value.toISOString().substring(0, 10)
    }

    cadastrar(form: NgForm) :void {
        if(form.valid) {
            this.newUser =  {
                login: form.value.login,
                senha: form.value.senha,
                id: 0,
                email: form.value.email,
                nome: form.value.nome,
                sobrenome: form.value.sobrenome,
                telefone: form.value.telefone === '' ? null : form.value.telefone,
                dataNascimento: this.dataNascimento,
                endereco: form.value.endereco === '' ? null : form.value.endereco,
                cidade: form.value.cidade === '' ? null : form.value.cidade,
                cep: form.value.cep === '' ? null : form.value.cep,
                tipo: 'paciente',
                paciente: {
                    cpf: form.value.cpf,
                    psicologo_crp: this.selection!.crp,
                    usuario_id: 0,
                    valorConsulta: this.selection!.valor,
                    responsavel: form.value.responsavel === '' ? null : form.value.responsavel,
                },
            };
            this.ud.addUser(this.newUser).subscribe((res) => {
                if(res.msg === 'ok') {
                    alert("Seu cadastro foi registrado com sucesso!")
                    form.reset()
                    this.router.navigate(['/'])
                }
            })
        } else { console.log("forms inválido!")}
        form.reset()
    }

    voltar() :void {
        this.ls.setActiveRoute('/');
        this.router.navigate(['']);
    }
}
