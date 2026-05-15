import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DelawareMapProps {
  data: Record<string, number>;
  title: string;
  unit?: string;
}

export default function DelawareMap({ data, title, unit = '$' }: DelawareMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    fetch('/delaware_counties.geojson')
      .then(res => res.json())
      .then(json => setGeoJsonData(json))
      .catch(err => console.error("Could not load Python GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (!svgRef.current || !geoJsonData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // COMPACT DIMENSIONS
    const width = 200;
    const height = 320;

    const projection = d3.geoMercator()
      .fitSize([width, height], geoJsonData);

    const pathGenerator = d3.geoPath().projection(projection);

    const values = Object.values(data);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([d3.min(values) || 0, d3.max(values) || 1000]);

    const g = svg.append('g');

    // Vector shapes
    g.selectAll('path')
      .data(geoJsonData.features)
      .enter()
      .append('path')
      .attr('d', (d: any) => pathGenerator(d))
      .attr('fill', (d: any) => colorScale(data[d.properties.GEOID] || 0))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .on('mouseover', function() { d3.select(this).attr('opacity', 0.8); })
      .on('mouseout', function() { d3.select(this).attr('opacity', 1); });

    // Pinned Micro-Labels
    g.selectAll('text')
      .data(geoJsonData.features)
      .enter()
      .append('text')
      .attr('x', (d: any) => pathGenerator.centroid(d)[0])
      .attr('y', (d: any) => {
        const y = pathGenerator.centroid(d)[1];
        // Minor nudge adjustments for hyper-compact typography constraints
        return d.properties.NAME === 'Kent' ? y + 4 : y;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none') // Prevents flickering on text hover
      .text((d: any) => {
        const cost = data[d.properties.GEOID] || 0;
        return `${d.properties.NAME}: ${unit}${Math.round(cost)}`;
      });

  }, [data, geoJsonData, unit]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-between w-full h-full min-h-[400px]">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">{title}</h3>
      
      {/* Small Map Wrapper */}
      <div className="w-full flex justify-center my-2">
        <svg ref={svgRef} width="200" height="320" viewBox="0 0 200 320" className="max-w-full h-auto"></svg>
      </div>
      
      {/* Small Inline Legend */}
      <div className="flex gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-tight border-t border-gray-50 pt-3 w-full justify-center">
        <span className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-[#deebf7]"></div> Low
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-[#084594]"></div> High
        </span>
      </div>
    </div>
  );
}