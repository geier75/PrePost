import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useTheme } from 'next-themes';

interface Globe3DProps {
  onCountrySelect: (countryCode: string) => void;
}

export default function Globe3D({ onCountrySelect }: Globe3DProps) {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<any>(null);

  useEffect(() => {
    // Load GeoJSON data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="w-full h-[400px] relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
      <Globe
        ref={globeEl}
        height={400}
        width={600}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
        polygonCapColor={d => d === hoverD ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255, 255, 255, 0.05)'}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }: any) => `
          <div class="bg-black/80 text-white px-2 py-1 rounded border border-white/20 text-xs backdrop-blur-md">
            ${d.ADMIN} (${d.ISO_A2})
          </div>
        `}
        onPolygonHover={setHoverD}
        onPolygonClick={({ properties: d }: any) => {
          onCountrySelect(d.ISO_A2);
          // Focus on country
          if (globeEl.current) {
            // @ts-ignore
            const { lat, lng, altitude } = globeEl.current.getCoords(d.lat, d.lng, 1.5);
            globeEl.current.pointOfView({ lat: d.LABEL_Y, lng: d.LABEL_X, altitude: 1.5 }, 1000);
          }
        }}
      />
      <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground bg-black/50 px-2 py-1 rounded">
        Interactive 3D Mode
      </div>
    </div>
  );
}
