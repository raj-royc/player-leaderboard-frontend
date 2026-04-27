import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;

export interface Player {
  id: number;
  name: string;
}
export interface OverallEntry {
  rank: number;
  playerId: number;
  playerName: string;
  totalPoints: number;
  ineligible: boolean;
}
export interface WeeklyEntry {
  rank: number;
  playerId: number;
  playerName: string;
  totalPoints: number;
}
export interface AbsenceEntry {
  playerId: number;
  playerName: string;
  absenceCount: number;
  ineligible: boolean;
}
export interface PodiumEntry {
  playerId: number;
  playerName: string;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

export interface MatchSubmitRequest {
  matchNumber: number;
  matchDate: string;
  firstPlacePlayerId: number;
  secondPlacePlayerId: number;
  thirdPlacePlayerId: number;
  bonusPoints: number | null;
  absentPlayerIds: number[];
}

export const getPlayers = () =>
  api.get<Player[]>("/players").then((r) => r.data);
export const getOverall = () =>
  api.get<OverallEntry[]>("/leaderboard/overall").then((r) => r.data);
export const getWeekly = (week: number) =>
  api
    .get<WeeklyEntry[]>(`/leaderboard/weekly?week=${week}`)
    .then((r) => r.data);
export const getAbsences = () =>
  api.get<AbsenceEntry[]>("/absences").then((r) => r.data);
export const getPodiums = () =>
  api.get<PodiumEntry[]>("/podiums").then((r) => r.data);
export const submitMatch = (data: MatchSubmitRequest) =>
  api.post("/matches/submit", data);
export const getMatches = () =>
  api
    .get<
      {
        id: number;
        matchNumber: number;
        isCompleted: boolean;
        weekNumber: number | null;
      }[]
    >("/matches")
    .then((r) => r.data);

export interface MatchTopThree {
  matchNumber: number;
  matchDate: string;
  firstPlace: string;
  secondPlace: string;
  thirdPlace: string;
}

export interface MatchSubmitRequest {
  matchNumber: number;
  matchDate: string;
  firstPlacePlayerId: number;
  secondPlacePlayerId: number;
  thirdPlacePlayerId: number;
  bonusPoints: number | null;
  absentPlayerIds: number[];
  isLastGameOfWeek: boolean;
}

export const getMatchTopThree = (matchNumber: number) =>
  api
    .get<MatchTopThree>(`/matches/${matchNumber}/topthree`)
    .then((r) => r.data);
