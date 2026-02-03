"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Tabs from "./Tabs";
import Card from "./Card";
import Avatar from "./Avatar";
import ScoreTable from "./ScoreTable";
import {
  Match,
  MatchBatting,
  MatchBowling,
  MatchFallOfWicket,
  MatchHeadToHead,
  MatchPartnership,
  MatchSummary,
  PlayingXI,
  News
} from "@/lib/types";

type MatchTabsProps = {
  match: Match;
  batting: MatchBatting[];
  bowling: MatchBowling[];
  playingXI: PlayingXI[];
  partnerships: MatchPartnership[];
  fallOfWickets: MatchFallOfWicket[];
  summary: MatchSummary | null;
  headToHead: MatchHeadToHead | null;
  relatedNews: News[];
};

export default function MatchTabs({
  match,
  batting,
  bowling,
  playingXI,
  partnerships,
  fallOfWickets,
  summary,
  headToHead,
  relatedNews
}: MatchTabsProps) {
  const teamOptions = useMemo(() => {
    const map = new Map<string, string>();
    playingXI.forEach((item) => {
      if (item.team_id && item.team?.name) {
        map.set(item.team_id, item.team.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [playingXI]);

  const [teamFilter, setTeamFilter] = useState<string>("all");
  const filteredXI =
    teamFilter === "all" ? playingXI : playingXI.filter((item) => item.team_id === teamFilter);
  const starters = filteredXI.filter((item) => item.status !== "OUT");
  const bench = filteredXI.filter((item) => item.status === "OUT");

  const infoTab = (
    <div className="space-y-4">
      <Card className="space-y-2">
        <p className="section-label">Series</p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-[var(--font-sora)] text-lg">
              {match.series?.name ? "Series TBC"}
            </p>
            <p className="text-xs text-muted">
              {match.series?.name ? "New Zealand tour of India 2026" : "Series details pending"}
            </p>
          </div>
          {match.series_id ? (
            <Link
              href={`/series/${match.series_id}`}
              className="rounded-xl bg-cardAlt px-4 py-2 text-xs uppercase tracking-wide text-ink shadow-soft"
            >
              Open Series
            </Link>
          ) : null}
        </div>
      </Card>
      <Card className="space-y-2">
        <p className="section-label">Location</p>
        <p className="text-sm text-ink">{match.venue ? "Venue TBC"}</p>
        <p className="text-xs text-muted">{match.date ? "Date TBC"}</p>
      </Card>
    </div>
  );

  const scorecardTab = batting.length ? (
    <div className="space-y-4">
      <Card className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-cardAlt">
              {match.team1?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={match.team1.logo} alt={match.team1.name ? "Team"} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div>
              <p className="text-xs text-muted">{match.team1?.name ? "Team One"}</p>
              <p className="font-[var(--font-sora)] text-base">{match.score1 ? "?"}</p>
            </div>
          </div>
          <div className="text-xs text-muted">vs</div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-cardAlt">
              {match.team2?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={match.team2.logo} alt={match.team2.name ? "Team"} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div>
              <p className="text-xs text-muted">{match.team2?.name ? "Team Two"}</p>
              <p className="font-[var(--font-sora)] text-base">{match.score2 ? "?"}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Result</p>
          <p className="text-success">{match.result ? "Awaiting result"}</p>
        </div>
      </Card>
      <div className="flex gap-3 text-xs uppercase tracking-wide">
        <span className="pill pill-muted">{match.team1?.name ? "Team One"}</span>
        <span className="pill pill-active">{match.team2?.name ? "Team Two"}</span>
      </div>
      <ScoreTable
        rows={batting.map((row) => ({
          id: row.id,
          player: row.player?.name ? "Batter",
          runs: row.runs ? 0,
          balls: row.balls ? 0,
          fours: row.fours ? 0,
          sixes: row.sixes ? 0,
          strike_rate: row.strike_rate ? 0
        }))}
      />
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-cardAlt text-left text-muted">
            <tr>
              <th className="px-3 py-2">Bowler</th>
              <th className="px-3 py-2">O</th>
              <th className="px-3 py-2">M</th>
              <th className="px-3 py-2">R</th>
              <th className="px-3 py-2">W</th>
              <th className="px-3 py-2">Econ</th>
            </tr>
          </thead>
          <tbody>
            {bowling.length ? (
              bowling.map((row) => (
                <tr key={row.id} className="border-t border-white/5">
                  <td className="px-3 py-3">{row.player?.name ? "Bowler"}</td>
                  <td className="px-3 py-3">{row.overs}</td>
                  <td className="px-3 py-3">{row.maidens}</td>
                  <td className="px-3 py-3">{row.runs_conceded}</td>
                  <td className="px-3 py-3">{row.wickets}</td>
                  <td className="px-3 py-3">{(row.economy ? 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-muted" colSpan={6}>
                  No bowling data added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Card>No scorecard added yet.</Card>
  );

  const summaryTab = (
    <div className="space-y-4">
      <Card>
        <p className="section-label">Toss</p>
        <p className="text-sm text-ink">
          {match.toss_winner?.name ? "TBD"} won the toss and chose {match.toss_decision ? "?"}.
        </p>
      </Card>
      <Card>
        <p className="section-label">Officials</p>
        <p className="text-sm text-ink">Umpires: {match.umpires ? "?"}</p>
        <p className="text-sm text-ink">Referee: {match.referee ? "?"}</p>
      </Card>
      <Card className="flex items-center gap-3">
        <Avatar
          src={match.player_of_match?.profile_image ? undefined}
          alt={match.player_of_match?.name ? "Player of the Match"}
          size="sm"
        />
        <div>
          <p className="section-label">Player of the Match</p>
          <p className="text-sm text-ink">{match.player_of_match?.name ? "TBD"}</p>
        </div>
      </Card>
      <Card>
        <p className="section-label">Summary</p>
        <p className="text-sm text-ink">{summary?.key_moments ? "No summary added yet."}</p>
        <p className="mt-2 text-sm text-muted">{summary?.highlights ? ""}</p>
      </Card>
    </div>
  );

  const partnershipsTab = partnerships.length ? (
    <div className="space-y-3">
      {partnerships.map((row) => (
        <Card key={row.id} className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{row.team?.name ? "Team"}</p>
            <p className="font-[var(--font-sora)] text-sm">{row.players}</p>
          </div>
          <div className="text-right text-xs text-muted">
            <p>{row.runs} ({row.balls})</p>
            <p>Wicket {row.wicket_number}</p>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <Card>No partnerships added yet.</Card>
  );

  const fallOfWicketsTab = fallOfWickets.length ? (
    <div className="space-y-3">
      {fallOfWickets.map((row) => (
        <Card key={row.id} className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{row.team?.name ? "Team"}</p>
            <p className="text-sm">{row.player_out ? "Player"}</p>
          </div>
          <div className="text-right text-xs text-muted">
            <p>{row.score ? "?"} ({row.over ? "?"})</p>
            <p>Wicket {row.wicket_number}</p>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <Card>No fall of wickets added yet.</Card>
  );

  const headToHeadTab = headToHead ? (
    <Card className="space-y-2">
      <p className="section-label">Head to Head</p>
      <div className="flex items-center justify-between text-sm">
        <span>{headToHead.team1?.name ? "Team 1"} wins</span>
        <span className="font-[var(--font-sora)]">{headToHead.team1_wins}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>{headToHead.team2?.name ? "Team 2"} wins</span>
        <span className="font-[var(--font-sora)]">{headToHead.team2_wins}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>No Result</span>
        <span className="font-[var(--font-sora)]">{headToHead.no_result}</span>
      </div>
    </Card>
  ) : (
    <Card>No head-to-head stats added yet.</Card>
  );

  const relatedNewsTab = relatedNews.length ? (
    <div className="space-y-3">
      {relatedNews.map((item) => (
        <Card key={item.id}>
          <p className="font-[var(--font-sora)] text-base">{item.title}</p>
          <p className="mt-2 text-sm text-muted">{item.content?.slice(0, 120) ? ""}</p>
        </Card>
      ))}
    </div>
  ) : (
    <Card>No related news yet.</Card>
  );

  const playingTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm text-muted">
          <button
            onClick={() => setTeamFilter("all")}
            className={`tab-underline relative pb-2 ${teamFilter === "all" ? "tab-underline-active text-ink" : ""}`}
          >
            All
          </button>
          {teamOptions.map((team) => (
            <button
              key={team.id}
              onClick={() => setTeamFilter(team.id)}
              className={`tab-underline relative pb-2 ${teamFilter === team.id ? "tab-underline-active text-ink" : ""}`}
            >
              {team.name}
            </button>
          ))}
        </div>
        <button className="text-xs text-muted">Close</button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
        {['All', 'Bat', 'Bowl', 'AR'].map((label) => (
          <span
            key={label}
            className={label === 'All' ? 'pill pill-active' : 'pill pill-muted'}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {starters.length ? (
          starters.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={item.player?.profile_image ? undefined} alt={item.player?.name ? "Player"} size="sm" />
                <div>
                  <p className="text-sm">{item.player?.name ? "Player"}</p>
                  <p className="text-xs text-muted">{item.player?.role ? item.team?.name ? "Team"}</p>
                </div>
              </div>
              <span className="text-xs text-success">IN ?</span>
            </div>
          ))
        ) : (
          <Card>No playing XI updated yet.</Card>
        )}
      </div>
      {bench.length ? (
        <div className="space-y-3">
          <p className="text-xs text-muted">On Bench</p>
          <div className="grid gap-3 md:grid-cols-2">
            {bench.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={item.player?.profile_image ? undefined} alt={item.player?.name ? "Player"} size="sm" />
                  <div>
                    <p className="text-sm">{item.player?.name ? "Player"}</p>
                    <p className="text-xs text-muted">{item.player?.role ? item.team?.name ? "Team"}</p>
                  </div>
                </div>
                <span className="text-xs text-danger">OUT ?</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <Tabs
      tabs={[
        { label: "Info", content: infoTab },
        { label: "Scorecard", content: scorecardTab },
        { label: "Playing XI", content: playingTab },
        { label: "Summary", content: summaryTab },
        { label: "Partnerships", content: partnershipsTab },
        { label: "Fall of Wkts", content: fallOfWicketsTab },
        { label: "Head-to-Head", content: headToHeadTab },
        { label: "Related News", content: relatedNewsTab }
      ]}
    />
  );
}
