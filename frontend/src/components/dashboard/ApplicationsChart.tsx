'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartPoint {
  date: string;
  sollicitaties: number;
}

interface ApplicationsChartProps {
  applications: { appliedAt: string }[];
}

function buildChartData(applications: { appliedAt: string }[]): ChartPoint[] {
  const days = 30;
  const today = new Date();

  // Groepeer echte sollicitaties per dag
  const countByDay: Record<string, number> = {};
  for (const app of applications) {
    const d = app.appliedAt.slice(0, 10);
    countByDay[d] = (countByDay[d] ?? 0) + 1;
  }

  const data: ChartPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    data.push({ date: label, sollicitaties: countByDay[key] ?? 0 });
  }

  return data;
}

export default function ApplicationsChart({ applications }: ApplicationsChartProps) {
  const data = buildChartData(applications);
  const total = applications.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-slate-900">Sollicitaties laatste 30 dagen</h2>
          <p className="text-sm text-slate-500 mt-0.5">Totaal: {total} sollicitatie(s)</p>
        </div>
        <span className="text-2xl font-bold text-sky-600">{total}</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSollicitaties" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
              fontSize: 13,
            }}
            labelStyle={{ color: '#475569', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="sollicitaties"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#gradSollicitaties)"
            dot={false}
            activeDot={{ r: 5, fill: '#0ea5e9' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
