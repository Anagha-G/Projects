import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})

export class AdminnavComponent implements OnInit {
   showSubmenu = false;
   username: string | null = null;
   role: string | null = null;

  constructor(private router:Router, private authService: AuthService) {}


  ngOnInit() {
     const token = this.authService.getToken();
     if (token) {
       this.username = localStorage.getItem('userName');
       var user=localStorage.getItem("userId")
       this.role = localStorage.getItem('userRole');
     }
  }

   logout():void
   {
    Swal.fire({
      title : "Logging you out",
      text : "Please wait...",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );
    this.authService.logout().subscribe(
      (res) => {
        if(res){
          Swal.close();
          this.router.navigate(['/login']);
        }
      }
    );
   }
}