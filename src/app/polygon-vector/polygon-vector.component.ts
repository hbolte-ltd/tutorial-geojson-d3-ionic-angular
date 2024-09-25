import {
  Component,
  OnChanges,
  AfterViewInit,
  Input,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {geoMercator, geoPath, select} from "d3";
import {Point, Polygon} from "geojson";
import {rewind} from "@turf/turf";

@Component({
  selector: "app-polygon-vector",
  templateUrl: "./polygon-vector.component.html",
  styleUrls: ["./polygon-vector.component.scss"],
})
export class PolygonVectorComponent implements OnChanges, AfterViewInit {
  @Input() public boundary!: Polygon;
  @Input() public centroid!: Point;
  @Input() public id = "d3-vector";
  @Input() public width = 250;
  @Input() public height = 250;
  @Input() public padding = 25;
  @Input() public showCentroid = false;
  @Input() public showPointLabels = false;
  @Input() public primaryColor!: string;
  @Input() public backgroundColor!: string;
  @Input() public dashedStroke = true;

  private svg: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  public ngOnChanges(): void {
    this.updateView();
  }

  public ngAfterViewInit(): void {
    this.updateView();
  }

  private updateView(): void {
    this.ngZone.run(() => {
      if (this.boundary) {
        this.createSvg(this.boundary, this.padding);
      }
    });
  }

  private createMapElement(projection: any, polygon: Polygon): any {
    const svg = select(`#${this.id}`)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    svg
      .selectAll("path")
      .data([polygon])
      .enter()
      .append("path")
      .style(
        this.dashedStroke ? "stroke-dasharray" : "stroke-width",
        this.dashedStroke ? "3, 3" : "1"
      )
      .attr("d", geoPath().projection(projection))
      .style("fill", this.backgroundColor)
      .style("fill-opacity", 0.5)
      .style("stroke", this.primaryColor);

    return svg;
  }

  private addCentroidToMap(svg: any, projection: any, polygon: Polygon): void {
    svg
      .selectAll("centroid")
      .data([polygon])
      .enter()
      .append("circle")
      .attr(
        "cx",
        (feature: any) => geoPath().projection(projection).centroid(feature)[0]
      )
      .attr(
        "cy",
        (feature: any) => geoPath().projection(projection).centroid(feature)[1]
      )
      .attr("r", "2px")
      .style("fill", this.primaryColor);
  }

  private addPointLabelsToMap(svg: any, projection: any, polygon: Polygon) {
    const nPoints = polygon.coordinates[0].length - 1;
    const centroidX = geoPath().projection(projection).centroid(polygon)[0];
    const centroidY = geoPath().projection(projection).centroid(polygon)[1];

    for (let i = 0; i < nPoints; i++) {
      const geoBefore = polygon.coordinates[0][i];
      const pointBefore = projection(geoBefore);

      if (!pointBefore) continue;

      const letter = this.getLetter(i);

      const xSign = pointBefore[0] <= centroidX ? -1 : 1;
      const ySign = pointBefore[1] <= centroidY ? -1 : 1;

      const upperPaddingRatio = 0.5;
      const lowerPaddingRatio = 1;

      const paddingX = 10;
      const paddingY =
        ySign == -1 ? upperPaddingRatio * 20 : lowerPaddingRatio * 20;

      svg
        .selectAll("corners")
        .data([polygon])
        .enter()
        .append("text")
        .attr("x", pointBefore[0] + xSign * paddingX)
        .attr("y", pointBefore[1] + ySign * paddingY)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", this.primaryColor)
        .text(letter);
    }
  }

  private createSvg(polygon: Polygon, padding: number): void {
    if (this.svg) {
      this.svg.remove();
    }

    polygon = rewind(polygon, {reverse: true}) as Polygon;

    const svgPadding = [padding, padding];
    const svgExtent: [[number, number], [number, number]] = [
      [svgPadding[0], svgPadding[1]],
      [this.width - svgPadding[0], this.height - svgPadding[1]],
    ];

    const projection = geoMercator().fitExtent(svgExtent, polygon);

    this.svg = this.createMapElement(projection, polygon);

    if (this.showCentroid) {
      this.addCentroidToMap(this.svg, projection, polygon);
    }

    if (this.showPointLabels) {
      this.addPointLabelsToMap(this.svg, projection, polygon);
    }

    this.cdRef.detectChanges();
  }

  private getLetter(index: number, isLast = false): string {
    if (isLast) {
      return String.fromCharCode(65);
    }

    let str = "";

    do {
      str = String.fromCharCode(65 + (index % 26)) + str;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);

    return str;
  }
}
