interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  readonly data: readonly DonutDatum[];
  readonly size?: number;
  readonly thickness?: number;
}

export default function DonutChart({ data, size = 180, thickness = 32 }: DonutChartProps) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = data.reduce((a, b) => a + b.value, 0);

  if (total === 0) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-3)',
          fontSize: 13,
        }}
      >
        Sem dados
      </div>
    );
  }

  const GAP = 3;
  let cumulative = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((item) => {
          const frac = item.value / total;
          const dash = Math.max(0, frac * C - GAP);
          const offset = -(cumulative / total) * C;
          cumulative += item.value;
          return (
            <circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${C}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
    </svg>
  );
}
