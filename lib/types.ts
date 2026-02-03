export type Player = {
  id: string;
  name: string;
  dob?: string | null;
  country?: string | null;
  role?: string | null;
  batting_style?: string | null;
  bowling_style?: string | null;
  height?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  banner?: string | null;
};

export type Team = {
  id: string;
  name: string;
  logo?: string | null;
  banner?: string | null;
  captain?: string | null;
  coach?: string | null;
};

export type Series = {
  id: string;
  name: string;
  banner?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  season?: string | null;
  format?: string | null;
  is_archived?: boolean | null;
};

export type Match = {
  id: string;
  series_id?: string | null;
  team1_id?: string | null;
  team2_id?: string | null;
  format?: string | null;
  score1?: string | null;
  score2?: string | null;
  overs1?: string | null;
  overs2?: string | null;
  result?: string | null;
  venue?: string | null;
  date?: string | null;
  thumbnail?: string | null;
  status?: string | null;
  toss_winner_id?: string | null;
  toss_decision?: string | null;
  umpires?: string | null;
  referee?: string | null;
  player_of_match_id?: string | null;
  team1?: Team | null;
  team2?: Team | null;
  series?: Series | null;
  toss_winner?: Team | null;
  player_of_match?: Player | null;
};

export type MatchBatting = {
  id: string;
  match_id: string;
  player_id: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  player?: Player | null;
};

export type MatchBowling = {
  id: string;
  match_id: string;
  player_id: string;
  overs: number;
  maidens: number;
  runs_conceded: number;
  wickets: number;
  economy: number;
  player?: Player | null;
};

export type PlayingXI = {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  status: "IN" | "OUT";
  player?: Player | null;
  team?: Team | null;
};

export type MatchPartnership = {
  id: string;
  match_id: string;
  team_id: string;
  players: string;
  runs: number;
  balls: number;
  wicket_number: number;
  team?: Team | null;
};

export type MatchFallOfWicket = {
  id: string;
  match_id: string;
  team_id: string;
  wicket_number: number;
  score?: string | null;
  over?: string | null;
  player_out?: string | null;
  team?: Team | null;
};

export type MatchSummary = {
  id: string;
  match_id: string;
  key_moments?: string | null;
  highlights?: string | null;
};

export type MatchHeadToHead = {
  id: string;
  match_id: string;
  team1_id: string;
  team2_id: string;
  team1_wins: number;
  team2_wins: number;
  no_result: number;
  team1?: Team | null;
  team2?: Team | null;
};

export type SeriesTeam = {
  id: string;
  series_id: string;
  team_id: string;
  team?: Team | null;
};

export type SeriesPoint = {
  id: string;
  series_id: string;
  team_id: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  no_result: number;
  points: number;
  net_run_rate: number;
  team?: Team | null;
};

export type SeriesSquad = {
  id: string;
  series_id: string;
  team_id: string;
  player_id: string;
  role?: string | null;
  team?: Team | null;
  player?: Player | null;
};

export type SeriesStatsLeader = {
  id: string;
  series_id: string;
  stat_type?: string | null;
  player_name?: string | null;
  team_name?: string | null;
  value?: number | null;
};

export type TeamSquad = {
  id: string;
  team_id: string;
  player_id: string;
  role?: string | null;
  player?: Player | null;
};

export type TeamRecord = {
  id: string;
  team_id: string;
  title?: string | null;
  value?: string | null;
  description?: string | null;
};

export type TeamTrophy = {
  id: string;
  team_id: string;
  title?: string | null;
  year?: string | null;
  description?: string | null;
};

export type TeamVenuePerformance = {
  id: string;
  team_id: string;
  venue?: string | null;
  matches: number;
  wins: number;
  losses: number;
  no_result: number;
};

export type Ranking = {
  id: string;
  category?: string | null;
  format?: string | null;
  rank: number;
  name?: string | null;
  team?: string | null;
  rating?: number | null;
};

export type RecordItem = {
  id: string;
  category?: string | null;
  title?: string | null;
  player_name?: string | null;
  team_name?: string | null;
  value?: string | null;
  format?: string | null;
  season?: string | null;
};

export type VenueRecord = {
  id: string;
  venue?: string | null;
  category?: string | null;
  title?: string | null;
  value?: string | null;
  season?: string | null;
};

export type PlayerComparison = {
  id: string;
  title?: string | null;
  player1?: string | null;
  player2?: string | null;
  stat1?: number | null;
  stat2?: number | null;
  format?: string | null;
};

export type Venue = {
  id: string;
  name?: string | null;
  city?: string | null;
  country?: string | null;
  capacity?: number | null;
  pitch_type?: string | null;
  average_score?: string | null;
  image?: string | null;
};

export type VenueImage = {
  id: string;
  venue_id: string;
  image_url?: string | null;
  caption?: string | null;
};

export type PlayerMatchStats = {
  id: string;
  player_id: string;
  match_id: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  average: number;
  innings: number;
  not_outs: number;
  player?: Player | null;
  match?: Match | null;
};

export type PlayerCareerStat = {
  id: string;
  player_id: string;
  format?: string | null;
  matches: number;
  innings: number;
  runs: number;
  highest_score: number;
  hundreds: number;
  fifties: number;
  strike_rate: number;
  average: number;
};

export type PlayerRecord = {
  id: string;
  player_id: string;
  title?: string | null;
  value?: string | null;
  description?: string | null;
};

export type PlayerGraphPoint = {
  id: string;
  player_id: string;
  format?: string | null;
  label?: string | null;
  value?: number | null;
};

export type News = {
  id: string;
  title: string;
  image?: string | null;
  content?: string | null;
  player_id?: string | null;
  match_id?: string | null;
  player?: Player | null;
};
