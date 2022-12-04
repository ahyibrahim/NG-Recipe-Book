import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";

import {Routes, RouterModule} from "@angular/router";
import {ShoppingListComponent} from "./shopping-list.component";
import {ShoppingEditComponent} from "./shopping-edit/shopping-edit.component";
import {SharedModule} from "../shared/shared.module";

const routes: Routes = [
  { path: '', component: ShoppingListComponent },
]

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class ShoppingListModule { }
