export const ScoreboardTypes = ["dual", "single", "solid"]
export type ScoreboardType = typeof ScoreboardTypes[number]

export const ScoreboardStylesMap: { [string: ScoreboardType]: string[] } = {
  dual: [
    "01-dual_white_black_color.png",
    "02-dual_white_black_mono.png",
    "03-dual_black_white_color.png",
    "04-dual_white__black_mono.png",
    "05-dual_white_white_mono.png",
  ],
  single: [
    "06-single_white_black_color.png",
    "07-single_white_black_mono.png",
    "08-single_black_white_color.png",
    "09-single_black_white_mono.png",
    "12-single_black_white_beige.png",
  ],
  solid: [
    "13-solid_white_black_color.png",
    "14-solid_white_white_mono.png",
    "15-solid_black_white_color.png",
    "16-solid_black_black_mono.png",
    "17-solid_black_white_beige.png",
  ],
}

export type Setting = {
  scoreboard_type: string
  scoreboard_style: string
}

export type Score = {
  p1_team: string
  p1_player_name: string
  p1_score: number
  p2_team: string
  p2_player_name: string
  p2_score: number
  round: string
  match_type: string
  tournament_name: string
}

export type Scenes = {
  sceneList: string[]
  currentScene: string
}
