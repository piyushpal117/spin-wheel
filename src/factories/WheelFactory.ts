import { WheelSection } from "../spinwheel/SpinWheel";
// import { fetchWheelConfig } from "../Hooks/services";
import { WHEEL_CONFIG } from "../constant/constant";

export class WheelFactory {
  static createSections(colors: string[], segments: number): WheelSection[] {
    const wheelData = WHEEL_CONFIG.wheelConfiguration;

    if (!Array.isArray(wheelData) || wheelData.length === 0) {
      console.warn("No wheel data available, falling back to dummy values.");
      return WheelFactory.createFallbackSections(segments, colors);
    }

    return wheelData.slice(0, segments).map((item, i) => {
      const label = String(item.sc);
      const colorIndex = i % colors.length;
      const color = parseInt(colors[colorIndex].replace("#", "0x"));
      return new WheelSection(label, color);
    });
  }
 
  private static createFallbackSections(segments: number, colors: string[]): WheelSection[] {
    const possibleLabels = ['10', '100', '200', '500', '1000', '1200', '1300', '1400'];
    return Array.from({ length: segments }, (_, i) => {
      const label = possibleLabels[i % possibleLabels.length];
      const colorIndex = i % colors.length;
      const color = parseInt(colors[colorIndex].replace("#", "0x"));
      return new WheelSection(label, color);
    });
  }
}
