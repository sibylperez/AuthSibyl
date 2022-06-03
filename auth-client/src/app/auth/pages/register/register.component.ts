import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  register(){
    const { name, email, password } = this.myForm.value;
    this.authService.register(name, email, password)
        .subscribe(ok => {
          if(ok === true){
            Swal.fire('Register Sucess', ok, 'success')
            this.router.navigateByUrl('/auth')
          } else {
            Swal.fire('Error', ok, 'error')
          }
        })
  }

}
