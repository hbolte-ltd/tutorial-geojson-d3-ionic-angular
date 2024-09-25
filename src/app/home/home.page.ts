import {Component} from "@angular/core";
import {centroid} from "@turf/turf";
import {Polygon} from "geojson";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  public boundary: Polygon = {
    type: "Polygon",
    coordinates: [
      [
        [100.501762, 13.75381], // Corner 1
        [100.502076, 13.75429], // Corner 2
        [100.502591, 13.754102], // Corner 3
        [100.502278, 13.753622], // Corner 4
        [100.501762, 13.75381], // Closing the polygon
      ],
    ],
  };

  public center = centroid(this.boundary).geometry;
}
