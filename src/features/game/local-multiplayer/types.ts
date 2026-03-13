export type LocalTeamId = "A" | "B";

export type LocalPlayerRole = "host" | "guest";

export interface LocalMultiplayerRoomParams {
  roomCode: string;
  team: LocalTeamId;
  role: LocalPlayerRole;
}


