import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(private ls: LoginService, private router: Router) {}

    @Output() login: EventEmitter<boolean> = new EventEmitter();

    ngOnInit(): void {}

    private user!: User | Observable<User> | undefined;

    logIn(form: NgForm): void {
        if (form.value.login === "" || form.value.senha === "") {
            return alert('Erro, verifique suas credenciais e tente novamente');
        } else {
            this.ls.findUser(form.value.login, form.value.senha).subscribe((user) => {
                //console.log(user)
                if (user === null) {
                    alert("Usuário ou senha inválidos!");
                    form.reset();
                } else if (user) {
                    console.log('logado como', user.login);
                    this.user = user;
                    this.ls.setUser(user);
                    this.login.emit(true);
                    form.reset();
                    this.router.navigate(['home']);
                }
            });
        }
    }
}
