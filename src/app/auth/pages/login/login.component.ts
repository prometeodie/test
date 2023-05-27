import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { FormsValidatorsService } from 'src/app/shared/services/forms-validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  public  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fvService = inject(FormsValidatorsService);

  public emailPatternMenssage: string = 'example.1@example.com, characters accepted:._ % -';
  public passwordPatternMenssage: string = 'Max 16.';

  // TODO:Borrar las credenciales en duro
  public myForm = this.fb.group({
    email:['admin@admin.com',[Validators.required, Validators.pattern(this.emailPattern)]],
    password:['123456',[Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
  })

  isValidField(field: string):boolean | null{
     return this.fvService.isValidField(this.myForm,field);
  }

  showError(field: string, pattern:string):string | null{
    return `${this.fvService.showError(this.myForm,field)}:${pattern}`
  }

  login(){
    const {email , password} = this.myForm.value;
    this.authService.login(email!, password!)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard/home'),
      error: (message)=>{
        Swal.fire('Error','Your Email or password is incorrect!','error')
      }
    });
  }

}
