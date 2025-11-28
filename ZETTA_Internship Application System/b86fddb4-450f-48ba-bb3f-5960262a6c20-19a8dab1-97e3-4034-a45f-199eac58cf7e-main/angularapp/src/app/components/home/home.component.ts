import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

    ngOnInit(): void {
      this.animateValue("scholarships", 0, 1500, 200);
      this.animateValue("students", 0, 9273, 200);
      this.animateValue("studentsHelped", 0, 9861, 200);
      this.animateValue("fundManaged", 0, 349, 200);
    }
  
    animateValue(id: string, start: number, end: number, duration: number): void {
      const range = end - start;
      let current = start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      const obj = document.getElementById(id);
  
      if (obj) {
        const timer = setInterval(() => {
          current += increment;
          obj.innerHTML = current.toLocaleString();
          if (current === end) {
            clearInterval(timer);
          }
        }, stepTime);
      }
    }
  }
  
  


