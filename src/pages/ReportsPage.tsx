import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportRangeTabs } from "@/components/reports/ReportRangeTabs";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { CategoryReportTable } from "@/components/reports/CategoryReportTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { ChartSkeleton } from "@/components/shared/LoadingSkeletons";
import { useReportData, type ReportRange } from "@/hooks/useReports";
import { formatDisplayDate } from "@/lib/date";

export function ReportsPage() {
  const [range, setRange] = React.useState<ReportRange>("monthly");
  const data = useReportData(range);

  return (
    <div>
      <PageHeader
        title="Reports"
        description={`${formatDisplayDate(data.start.toISOString().slice(0, 10))} — ${formatDisplayDate(
          data.end.toISOString().slice(0, 10)
        )}`}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ReportRangeTabs value={range} onChange={setRange} />
        <ExportButtons items={data.items} range={range} />
      </div>

      {data.isLoading ? (
        <ChartSkeleton />
      ) : (
        <div className="space-y-5">
          <ReportSummaryCards
            total={data.total}
            count={data.count}
            average={data.average}
            highest={data.highest}
          />

          <div>
            <h2 className="mb-3 font-display text-base font-semibold">Category Breakdown</h2>
            <CategoryReportTable rows={data.categoryBreakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
export default ReportsPage;
