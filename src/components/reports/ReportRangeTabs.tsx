import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReportRange } from "@/hooks/useReports";

interface Props {
  value: ReportRange;
  onChange: (value: ReportRange) => void;
}

export function ReportRangeTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as ReportRange)}>
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
