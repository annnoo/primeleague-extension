import type { PageServerData } from "../$types";
import { getLeaderboard } from "../../lib/api";

export async function load({params}: any) {
  return await fetch("http://localhost:3000").then(i => i.json());
} 
