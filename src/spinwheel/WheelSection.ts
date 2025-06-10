

//  Represents one section (slice) of the spin wheel.
 
export class WheelSection {
  label: string;
  color: number; 

  constructor(label: string, color: number) {
    this.label = label;
    this.color = color;
  }
}
