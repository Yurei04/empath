
import { EMPATH_MODES } from "./empathModes"

export function resolveEmpathAction(action) {
  switch (action) {
    case "CREATE_LETTER":
      return EMPATH_MODES.LETTER

    case "PLAY_GAME":
      return EMPATH_MODES.GAME

    case "PLAY_MUSIC":
      return EMPATH_MODES.MUSIC

    case "GO_HOME":
      return EMPATH_MODES.HOME

    default:
      return EMPATH_MODES.CHAT
  }
}
