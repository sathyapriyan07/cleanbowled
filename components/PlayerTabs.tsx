"use client";

import { useMemo, useState } from "react";
import Tabs from "./Tabs";
import Card from "./Card";
import {
  Match,
  Player,
  PlayerCareerStat,
  PlayerGraphPoint,
  PlayerMatchStats,
  PlayerRecord,
  News
} from "@/lib/types";

type PlayerTabsProps = {
  player: Player;
  matches: Match[];
  stats: PlayerMatchStats[];
  careerStats: PlayerCareerStat[];
  records: PlayerRecord[];
  graphPoints: PlayerGraphPoint[];
  news: News[];
};

export default function PlayerTabs({
  player,
  matches,
  stats,
  careerStats,
  records,
  graphPoints,
  news
}: PlayerTabsProps) {
  const [careerFormat, setCareerFormat] = useState("All");
  const [graphFormat, setGraphFormat] = useState("All");
  const [matchFormat, setMatchFormat] = useState("All");
  const age = player.dob
    ? Math.floor((Date.now() - new Date(player.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const filteredStats = useMemo(() => {
    if (matchFormat === "All") return stats;
    return stats.filter((row) => row.match?.format === matchFormat);
  }, [matchFormat, stats]);

  const featured = filteredStats[0];
  const featuredMatch = featured?.match
    ? `${featured.match.team1?.name ? "Team"} vs ${featured.match.team2?.name ? "Team"}`
    : "Match TBC";
  const featuredDate = featured?.match?.date ? "TBD";
  const featuredSeries = featured?.match?.series?.name;

  const tabs = [
    {
      label: "Overview",
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
            <span className="pill pill-active">{player.role ? "All-rounder"}</span>
            <span className="pill pill-muted">{player.batting_style ? "Right-hand"}</span>
            <span className="pill pill-muted">{player.bowling_style ? "Right-arm"}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="section-label">Role</p>
              <p className="font-[var(--font-sora)] text-lg">{player.role ? "All-rounder"}</p>
            </Card>
            <Card>
              <p className="section-label">Batting Style</p>
              <p className="font-[var(--font-sora)] text-lg">{player.batting_style ? "Right-hand"}</p>
            </Card>
            <Card>
              <p className="section-label">Bowling Style</p>
              <p className="font-[var(--font-sora)] text-lg">{player.bowling_style ? "Right-arm"}</p>
            </Card>
            <Card>
              <p className="section-label">Matches</p>
              <p className="font-[var(--font-sora)] text-lg">{matches.length}</p>
            </Card>
          </div>
          <Card>
            <p className="section-label">Bio</p>
            <p className="mt-2 text-sm text-ink">{player.bio ? "No bio available yet."}</p>
          </Card>
        </div>
      )
    },
    {
      label: "Matches",
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
            {["All", "ODI", "T20I", "Test", "IPL", "BBL", "SA20", "MLC"].map((label) => (
              <button
                key={label}
                onClick={() => setMatchFormat(label)}
                className={label === matchFormat ? "pill pill-active" : "pill pill-muted"}
              >
                {label}
              </button>
            ))}
          </div>
          {filteredStats.length ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-cardAlt">
                    {featured?.match?.team1?.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.match.team1.logo}
                        alt={featured.match.team1.name ? "Team"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                        {featured?.match?.team1?.name?.slice(0, 2).toUpperCase() ? "TM"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-[var(--font-sora)] text-base">
                      {featuredSeries ? featuredMatch}
                    </p>
                    <p className="text-xs text-muted">
                      {featuredDate} ? Played for {player.country ? "Team"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted">v</span>
              </div>
              <Card className="overflow-hidden p-0">
                <div className="grid grid-cols-4 gap-2 border-b border-white/5 px-4 py-4 text-center">
                  {[
                    { label: "Runs", value: featured?.runs ? 0 },
                    { label: "Inns", value: featured?.innings ? 1 },
                    { label: "SR", value: featured?.strike_rate?.toFixed(2) ? "0.00" },
                    { label: "Avg", value: featured?.average?.toFixed(2) ? "0.00" }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-[var(--font-sora)] text-base text-ink">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 pt-3 text-[10px] uppercase tracking-wide text-muted">
                  <span>Score</span>
                  <span>Date</span>
                  <span className="text-right">Match</span>
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 pb-4 text-sm">
                  <span>{featured?.runs ? 0} ({featured?.balls ? 0})</span>
                  <span>{featuredDate}</span>
                  <span className="text-right text-accent">{featuredMatch}</span>
                </div>
              </Card>
              <div className="space-y-3">
                {filteredStats.slice(1).map((row) => (
                  <div key={row.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 overflow-hidden rounded-xl bg-cardAlt">
                        {row.match?.team1?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={row.match.team1.logo}
                            alt={row.match.team1.name ? "Team"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                            {row.match?.team1?.name?.slice(0, 2).toUpperCase() ? "TM"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-[var(--font-sora)] text-sm">
                          {row.match?.series?.name ?
                            `${row.match?.team1?.name ? "Team"} vs ${row.match?.team2?.name ? "Team"}`}
                        </p>
                        <p className="text-xs text-muted">
                          {row.match?.date ? "TBD"} ? Played for {player.country ? "Team"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted">v</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card>No match stats added yet.</Card>
          )}
        </div>
      )
    },
    {
      label: "Career Stats",
      content: careerStats.length ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
            {["All", "Test", "ODI", "T20I", "IPL", "BBL", "SA20", "MLC"].map((format) => (
              <button
                key={format}
                onClick={() => setCareerFormat(format)}
                className={careerFormat === format ? "pill pill-active" : "pill pill-muted"}
              >
                {format}
              </button>
            ))}
          </div>
          {careerStats
            .filter((row) => careerFormat === "All" || row.format === careerFormat)
            .map((row) => (
              <Card key={row.id} className="overflow-hidden p-0">
                <div className="border-b border-white/5 px-4 py-3 text-xs uppercase tracking-wide text-muted">
                  {row.format ? "Format"}
                </div>
                <div className="grid grid-cols-3 gap-2 px-4 py-4 text-center">
                  {[
                    { label: "Matches", value: row.matches },
                    { label: "Innings", value: row.innings },
                    { label: "Runs", value: row.runs },
                    { label: "HS", value: row.highest_score },
                    { label: "100s", value: row.hundreds },
                    { label: "50s", value: row.fifties },
                    { label: "SR", value: row.strike_rate.toFixed(2) },
                    { label: "Avg", value: row.average.toFixed(2) }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-[var(--font-sora)] text-base text-ink">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <Card>No career stats added yet.</Card>
      )
    },
    {
      label: "Records",
      content: records.length ? (
        <div className="space-y-3">
          {records.map((row) => (
            <Card key={row.id}>
              <p className="text-xs uppercase tracking-wide text-muted">{row.title ? "Record"}</p>
              <p className="font-[var(--font-sora)] text-base">{row.value ? ""}</p>
              {row.description ? <p className="mt-2 text-sm text-muted">{row.description}</p> : null}
            </Card>
          ))}
        </div>
      ) : (
        <Card>No records added yet.</Card>
      )
    },
    {
      label: "News",
      content: news.length ? (
        <div className="space-y-3">
          {news.map((item) => (
            <Card key={item.id}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} className="mb-3 h-40 w-full rounded-xl object-cover" />
              ) : null}
              <p className="font-[var(--font-sora)] text-base">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.content?.slice(0, 140) ? ""}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card>No news yet.</Card>
      )
    },
    {
      label: "Graphs",
      content: graphPoints.length ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
            {["All", "Test", "ODI", "T20I", "IPL", "BBL", "SA20", "MLC"].map((format) => (
              <button
                key={format}
                onClick={() => setGraphFormat(format)}
                className={graphFormat === format ? "pill pill-active" : "pill pill-muted"}
              >
                {format}
              </button>
            ))}
          </div>
          {graphPoints
            .filter((row) => graphFormat === "All" || row.format === graphFormat)
            .map((row) => (
              <Card key={row.id}>
                <p className="text-xs uppercase tracking-wide text-muted">{row.format ? "Format"}</p>
                <div className="mt-3 flex items-end gap-3">
                  <div className="h-24 w-10 rounded-xl bg-cardAlt relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 w-full rounded-xl bg-accent"
                      style={{ height: `${Math.min(100, Number(row.value ? 0))}%` }}
                    />
                  </div>
                  <div>
                    <p className="font-[var(--font-sora)] text-lg text-ink">{row.value ? 0}</p>
                    <p className="text-xs text-muted">{row.label ? "Metric"}</p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <Card>No graph data yet.</Card>
      )
    },
    {
      label: "Player Info",
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="section-label">Country</p>
            <p className="font-[var(--font-sora)] text-lg">{player.country ? "--"}</p>
          </Card>
          <Card>
            <p className="section-label">Date of Birth</p>
            <p className="font-[var(--font-sora)] text-lg">{player.dob ? "--"}</p>
            <p className="text-xs text-muted">{age ? `${age} years` : "Age not set"}</p>
          </Card>
          <Card>
            <p className="section-label">Height</p>
            <p className="font-[var(--font-sora)] text-lg">{player.height ? "--"}</p>
          </Card>
        </div>
      )
    }
  ];

  return <Tabs tabs={tabs} />;
}
