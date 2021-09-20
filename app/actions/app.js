import { ADDJUMER, REMOVEJUMPER, SAVEHEIGHT } from "@constants";

export const addJumper = (data) => ({ type: ADDJUMER, data })
export const removeJumper = (data) => ({ type: REMOVEJUMPER, data })
export const saveHeight = (data) => ({ type: SAVEHEIGHT, data })
