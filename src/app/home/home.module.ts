import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {HomePage} from "./home.page";
import {HomePageRoutingModule} from "./home-routing.module";
import {PolygonVectorComponent} from "../polygon-vector/polygon-vector.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, PolygonVectorComponent],
})
export class HomePageModule {}
