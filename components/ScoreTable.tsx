type Row = {
  id: string;
  player: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
};

type ScoreTableProps = {
  rows: Row[];
};

export default function ScoreTable({ rows }: ScoreTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-cardAlt text-left text-muted">
          <tr>
            <th className="px-3 py-2">Batter</th>
            <th className="px-3 py-2">R</th>
            <th className="px-3 py-2">B</th>
            <th className="px-3 py-2">4s</th>
            <th className="px-3 py-2">6s</th>
            <th className="px-3 py-2">SR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-white/5">
              <td className="px-3 py-3">{r.player}</td>
              <td className="px-3 py-3">{r.runs}</td>
              <td className="px-3 py-3">{r.balls}</td>
              <td className="px-3 py-3">{r.fours}</td>
              <td className="px-3 py-3">{r.sixes}</td>
              <td className="px-3 py-3">{r.strike_rate.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
