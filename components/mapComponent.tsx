import React, { forwardRef, Ref } from "react";

type MapComponentProps = {
  ref: Ref<HTMLDivElement>;
};
const MapComponent: React.FC<MapComponentProps> = forwardRef(
  (props, ref) => {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <div ref={ref} style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }
);

MapComponent.displayName = 'MapComponent';

export default MapComponent;
