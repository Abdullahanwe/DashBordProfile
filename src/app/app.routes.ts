import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Certification} from './components/certification/certification';
import { Skills} from './components/skills/skills';
import { Contact} from './components/contact/contact';
import { Projects} from './components/projects/projects';
import {Navbar}from './components/navbar/navbar'

export const routes: Routes = [{ path: '', component: Home },
  { path: 'about', component: About },
  { path: 'certification', component: Certification },
  { path: 'skills', component: Skills },
  { path: 'contact', component: Contact },
  { path: 'projects', component: Projects },
  { path: 'navbar', component: Navbar},];

