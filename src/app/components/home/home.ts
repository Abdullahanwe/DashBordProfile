import { Component } from '@angular/core';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Contact } from '../contact/contact';
import { Certification } from '../certification/certification';
import { Projects } from '../projects/projects';


@Component({
  selector: 'app-home',
  imports: [About,Skills,Contact,Certification,Projects],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
