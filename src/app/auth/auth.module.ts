import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  { path: '', component: AuthComponent }
]

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
    AuthComponent
  ]
})
export class AuthModule{}
