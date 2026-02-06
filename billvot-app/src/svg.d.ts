declare module "*.svg?react" {
  import React from "react";
  const disabled: boolean;
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
