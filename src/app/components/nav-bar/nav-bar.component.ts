import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {

    @Output() logout: EventEmitter<boolean> = new EventEmitter();

    constructor(private ls: LoginService, private router: Router) { }

    ngOnInit(): void {
        this.user = {login: '', senha: '', id: 0, email: '', dataNascimento: '', nome: '', sobrenome: '', telefone: '', endereco: '', cidade: '', cep: '', tipo: 'paciente'};
        this.subscription = this.ls.getActiveRoute().subscribe((newValue) => {
            this.currentRoute = newValue;
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @Input() user!: User;
    currentRoute!: string;
    subscription!: Subscription;

    onLogOut() :void {
        if(confirm("Você irá deslogar, tem certeza?")) {
            this.logout.emit(true);
            this.ls.setActiveRoute('/');
            console.log("rota ativa: /")
            this.router.navigate(['']);
        }
    }
}
