# Tutorial: GeoJSON with D3, Ionic, and Angular

This project demonstrates how to define and work with a geo-referenced data using GeoJSON and `turf.js` for geographic
computations within an Ionic and Angular framework, enhanced with D3 for visualizations.

## Overview

We define a land plot using an irregular quadrilateral with four corners and compute its centroid using `turf.js`.
The project uses TypeScript and GeoJSON format for the boundary and midpoint definitions. The example also integrates
D3 for rendering visualizations within an Ionic Angular app.

## Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/hbolte-ltd/tutorial-geojson-d3-ionic-angular.git
   cd tutorial-geojson-d3-ionic-angular
   ```

2. Install the required npm packages:

   ```sh
   npm install
   ```

3. Run the app:
   ```sh
   ionic serve
   ```

## Usage

### Import the `polygon-vector` Component

Import the necessary modules and components in your module and define the boundary:

```typescript
import {Polygon} from "geojson";
import {centroid} from "@turf/turf";

// Define the polygon for the boundary with four corners
const boundary: Polygon = {
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

// Use turf.js to calculate the precise centroid (midpoint)
const center = centroid(boundary);
```

### Use the `polygon-vector` Component in Your Template

Add the `polygon-vector` component to your template and bind it to the defined boundary and centroid:

```html
<app-polygon-vector
  [boundary]="boundary"
  [centroid]="center"
  [width]="300"
  [height]="300"
  [padding]="30"
  [primaryColor]="'#0099aa'"
  [backgroundColor]="'#eff0f1'"
  [showCentroid]="true"
  [showPointLabels]="true"
  [dashedStroke]="true"
>
</app-polygon-vector>
```

## License

This project is licensed under the MIT License. For more details, refer to the [LICENSE](./LICENSE) file.
