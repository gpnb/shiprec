import { useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

function AreaSelector({
  drawMode,
  confirmMode,
  setDrawMode,
  setConfirmMode,
  selectionPixels,
  setSelectionPixels,
  selectionBounds,
  setSelectionBounds
}) {
  const [startPt, setStartPt] = useState(null);
  const [endPt, setEndPt] = useState(null);
  const [startLL, setStartLL] = useState(null);
  const [mapContainer, setMapContainer] = useState(null);

  useEffect(() => {
    setMapContainer(document.querySelector('.leaflet-container'));
  }, []);

  useMapEvents({
    mousedown(e) {

      // ignore any clicks coming from inside our overlay UI
      if (e.originalEvent.target.closest('.selection-ui')) return;

      // start drawing if we're in drawMode, or if we've already drawn once (confirmMode)
      if (!drawMode && !confirmMode) return;
        
      // if they click on the map *after* confirming, wipe the old rectangle and go back to drawMode
      if (confirmMode) {
        setSelectionPixels(null);
        setSelectionBounds(null);
        setConfirmMode(false);
        setDrawMode(true);
      }
        
      // now record the new box‐start
      const pt = e.containerPoint;
      setStartPt(pt);
      setEndPt(pt);
      setStartLL(e.latlng);
    },
    mousemove(e) {
      if (!drawMode || !startPt) return;
      setEndPt(e.containerPoint);
    },
    mouseup(e) {
      if (!drawMode || !startPt || !endPt) return;
      // compute pixel rectangle
      const x = Math.min(startPt.x, endPt.x);
      const y = Math.min(startPt.y, endPt.y);
      const width = Math.abs(endPt.x - startPt.x);
      const height = Math.abs(endPt.y - startPt.y);
      setSelectionPixels({ x, y, width, height });

      // compute geo bounds
      const ll2 = e.latlng;
      const sw = L.latLng(
        Math.min(startLL.lat, ll2.lat),
        Math.min(startLL.lng, ll2.lng)
      );
      const ne = L.latLng(
        Math.max(startLL.lat, ll2.lat),
        Math.max(startLL.lng, ll2.lng)
      );
      setSelectionBounds({ southWest: sw, northEast: ne });

      // done drawing → enter confirm mode
      setStartPt(null);
      setEndPt(null);
      setDrawMode(false);
      setConfirmMode(true);
    }
  });

  if (!mapContainer) return null;

  // choose live‐draw or persisted rect
  let rect = null;
  if (drawMode && startPt && endPt) {
    rect = {
      x: Math.min(startPt.x, endPt.x),
      y: Math.min(startPt.y, endPt.y),
      width: Math.abs(endPt.x - startPt.x),
      height: Math.abs(endPt.y - startPt.y)
    };
  } else if (selectionPixels) {
    rect = selectionPixels;
  }
  if (!rect) return null;

  return ReactDOM.createPortal(
    <div
      className="pixel-area-rect"
      style={{
        position: 'absolute',
        top: `${rect.y}px`,
        left: `${rect.x}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: '2px dashed rgba(43, 61, 91)',
        backgroundColor: 'rgba(59, 171, 68, 0.1)',
        pointerEvents: 'none',
        zIndex: 999
      }}
    />,
    mapContainer
  );
}

export default AreaSelector;