import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatINR, formatCompactINR } from "@/lib/currency";

interface Props {
  data: { month: string; amount: number }[];
}

export function MonthlyTrendChart({ data }: Props) {
  const maxIndex = data.reduce((maxI, d, i, arr) => (d.amount > arr[maxI].amount ? i : maxI), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <p className="text-xs text-muted-foreground">Last 6 months</p>
      </CardHeader>
      <CardContent className="pl-1">
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCompactINR(v)}
                width={44}
              />
              <Tooltip
                formatter={(value: number) => formatINR(value)}
                cursor={{ fill: "hsl(var(--surface-hover))" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={36}>
                {data.map((_, i) => (
                  <Cell key={i} fill={i === maxIndex ? "#C9A24B" : "hsl(var(--muted-foreground) / 0.35)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
