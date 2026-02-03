import { Match, Player, Series } from "./types";

export const samplePlayers: Player[] = [
  {
    id: "demo-1",
    name: "Arjun Mehta",
    country: "India",
    role: "Top-order Batter",
    bio: "Aggressive opener known for powerplay dominance.",
    profile_image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=200&h=200"
  },
  {
    id: "demo-2",
    name: "Liam Carter",
    country: "Australia",
    role: "Fast Bowler",
    bio: "Right-arm quick with heavy swing under lights.",
    profile_image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=200&h=200"
  }
];

export const sampleSeries: Series[] = [
  {
    id: "series-1",
    name: "Oceanic Trophy 2026",
    location: "Sydney · Perth",
    start_date: "2026-01-10",
    end_date: "2026-02-20"
  }
];

export const sampleMatches: Match[] = [
  {
    id: "match-1",
    team1_id: "team-1",
    team2_id: "team-2",
    score1: "178/6",
    score2: "171/9",
    result: "India won by 7 runs",
    venue: "Harbor Oval",
    date: "2026-02-01",
    thumbnail: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=200&h=200"
  }
];
