interface BarDatum {
  label: string;
  approved: number;
  rejected: number;
}

interface BarChartProps {
  readonly data: readonly BarDatum[];
  readonly width?: number;
  readonly height?: number;
}

export default function BarChart({ data, width = 420, height = 160 }: BarChartProps) {
  const max = Math.max(...data.map(d => d.approved + d.rejected), 1);
  const padLeft = 32;
  const padBottom = 28;
  const chartH = height - padBottom;
  const barW = Math.floor((width - padLeft) / data.length) - 8;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = chartH - frac * chartH;
        return (
          <g key={frac}>
            <line
              x1={padLeft}
              y1={y}
              x2={width}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={padLeft - 6}
              y={y + 4}
              fill="var(--text-3)"
              fontSize={10}
              textAnchor="end"
            >
              {Math.round(frac * max)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const x = padLeft + i * (barW + 8) + 4;
        const approvedH = (d.approved / max) * chartH;
        const rejectedH = (d.rejected / max) * chartH;
        const totalH = approvedH + rejectedH;
        return (
          <g key={d.label}>
            {rejectedH > 0 && (
              <rect
                x={x}
                y={chartH - rejectedH}
                width={barW}
                height={rejectedH}
                fill="var(--red)"
                opacity={0.7}
                rx={2}
              />
            )}
            {approvedH > 0 && (
              <rect
                x={x}
                y={chartH - totalH}
                width={barW}
                height={approvedH}
                fill="var(--green)"
                opacity={0.85}
                rx={2}
              />
            )}
            <text
              x={x + barW / 2}
              y={height - 6}
              fill="var(--text-3)"
              fontSize={10}
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
