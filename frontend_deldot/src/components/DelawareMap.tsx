import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DE_COUNTIES } from '../types/policy';

interface DelawareMapProps {
  data: Record<string, number>;
  title: string;
  unit?: string;
}

export default function DelawareMap({ data, title, unit = '$' }: DelawareMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverInfo, setHoverInfo] = useState<{ name: string; value: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 500;

    // Simplified Delaware Geometry (Mocked paths for Kent, New Castle, Sussex)
    const counties = [
      { id: '10003', name: 'New Castle', path: 'M100,20 L200,20 L200,150 L100,150 Z' },
      { id: '10001', name: 'Kent', path: 'M100,150 L200,150 L200,300 L100,300 Z' },
      { id: '10005', name: 'Sussex', path: 'M100,300 L200,300 L200,480 L100,480 Z' }
    ];

    const values = Object.values(data);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([d3.min(values) || 0, d3.max(values) || 1000]);

    const g = svg.append('g');

    g.selectAll('path')
      .data(counties)
      .enter()
      .append('path')
      .attr('d', d => d.path)
      .attr('fill', d => colorScale(data[d.id] || 0))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('mousemove', function(event, d) {
        const [x, y] = d3.pointer(event, svg.node());
        const rect = svgRef.current!.getBoundingClientRect();
        setHoverInfo({ name: d.name, value: data[d.id] || 0, x: rect.left + x, y: rect.top + y });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        setHoverInfo(null);
      });

    // Labels
    g.selectAll('text')
      .data(counties)
      .enter()
      .append('text')
      .attr('x', 150)
      .attr('y', d => {
        if (d.id === '10003') return 85;
        if (d.id === '10001') return 225;
        return 390;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => `${d.name}: ${unit}${Math.round(data[d.id] || 0)}`);

  }, [data, unit]);

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{title}</h3>
      <svg ref={svgRef} width="300" height="500" viewBox="0 0 300 500"></svg>
      {hoverInfo && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg bg-gray-900 text-white text-xs p-2 shadow-lg"
          style={{ left: hoverInfo.x + 16, top: hoverInfo.y + 16, minWidth: 140 }}
        >
          <div className="font-bold">{hoverInfo.name}</div>
          <div>{unit}{hoverInfo.value.toFixed(0)} / vehicle</div>
        </div>
      )}
      <div className="mt-4 flex gap-4 text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100"></div>
          <span>Lower Cost</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-800"></div>
          <span>Higher Cost</span>
        </div>
      </div>
    </div>
  );
}
