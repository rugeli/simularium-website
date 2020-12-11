import { makeConstant } from "../util";
const BRANCH_NAME = "selection";
const makeSelectConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const DESELECT_FILE = makeSelectConstant("deselect-file");
export const SELECT_FILE = makeSelectConstant("select-file");
export const SELECT_METADATA = makeSelectConstant("select_metadata");
export const CHANGE_TIME_HEAD = makeSelectConstant("change-time-head");
export const SIDE_PANEL_COLLAPSED = makeSelectConstant("change-content-width");
export const HIGHLIGHT_AGENTS_BY_KEY = makeSelectConstant(
    "highlight-agents-by-key"
);
export const TURN_AGENTS_ON_BY_KEY = makeSelectConstant(
    "turn-agents-on-by-name"
);
export const SET_AGENTS_VISIBLE = makeSelectConstant("set-agents-visible");
export const DRAG_OVER_VIEWER = makeSelectConstant("drag-over-viewer");
export const RESET_DRAG_OVER_VIEWER = makeSelectConstant("drag-off-viewer");
export const SET_ALL_AGENT_COLORS = makeSelectConstant("set-all-agent-colors");
export const CHANGE_AGENT_COLOR = makeSelectConstant("change-agent-color");
export const START_BUFFERING = makeSelectConstant("start-buffering");
export const END_BUFFERING = makeSelectConstant("end-buffering");
