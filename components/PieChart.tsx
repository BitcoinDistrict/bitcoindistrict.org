import { PieChart as MinimalPieChart, PieChartProps } from 'react-minimal-pie-chart';

export interface PieChartData {
  title: string;
  value: number;
  color: string;
}

interface Props {
  data: PieChartData[];
  label?: string;
  className?: string;
}

export default function PieChart({ data, label, className }: Props) {
  return (
    <div className={className}>
      <MinimalPieChart
        data={data}
        label={({ dataEntry }) =>
          dataEntry.value > 0 ? `${dataEntry.title} (${dataEntry.value})` : ''
        }
        labelStyle={{
          fontSize: '5px',
          fontFamily: 'inherit',
          fill: '#333',
        }}
        radius={40}
        labelPosition={70}
        animate
      />
      {label && <div className="text-center text-xs mt-2 text-muted-foreground">{label}</div>}
    </div>
  );
} 