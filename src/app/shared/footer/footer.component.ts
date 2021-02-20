import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  year: number = new Date().getFullYear();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  faq()
  {
    this.router.navigate(['faq']);
  } 

  about()
  {
    this.router.navigate(['about-us']);
  }

  solutionService()
  {
    this.router.navigate(['solution-services']);
  }
} 
