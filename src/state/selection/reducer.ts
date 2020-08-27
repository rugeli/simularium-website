import { castArray, without } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    DESELECT_FILE,
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_ID,
    HIGHLIGHT_AGENT,
    TOGGLE_LOAD_FILE_MODAL,
    TURN_AGENTS_ON_BY_NAME,
    HIGHLIGHT_AGENTS_BY_NAME,
} from "./constants";
import {
    DeselectFileAction,
    ChangeAgentsRenderingStateAction,
    SelectionStateBranch,
    SelectMetadataAction,
    ChangeTimeAction,
    ChangeNumberCollapsedPanelsAction,
    HighlightAgentAction,
    ToggleAction,
} from "./types";

export const initialState = {
    files: [],
    time: 0,
    numberPanelsCollapsed: 0,
    agentIdsOn: [],
    agentNamesOn: [],
    hightlightedId: -1,
    highlightedAgentNames: [],
    modalOpen: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_FILE]: {
        accepts: (action: AnyAction): action is DeselectFileAction =>
            action.type === DESELECT_FILE,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            files: without(state.files, ...castArray(action.payload)),
        }),
    },
    [TURN_AGENTS_ON_BY_ID]: {
        accepts: (
            action: AnyAction
        ): action is ChangeAgentsRenderingStateAction =>
            action.type === TURN_AGENTS_ON_BY_ID,
        perform: (
            state: SelectionStateBranch,
            action: ChangeAgentsRenderingStateAction
        ) => {
            return {
                ...state,
                agentIdsOn: action.payload,
            };
        },
    },
    [TURN_AGENTS_ON_BY_NAME]: {
        accepts: (
            action: AnyAction
        ): action is ChangeAgentsRenderingStateAction =>
            action.type === TURN_AGENTS_ON_BY_NAME,
        perform: (
            state: SelectionStateBranch,
            action: ChangeAgentsRenderingStateAction
        ) => {
            return {
                ...state,
                agentNamesOn: action.payload,
            };
        },
    },

    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction =>
            action.type === SELECT_METADATA,
        perform: (
            state: SelectionStateBranch,
            action: SelectMetadataAction
        ) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
    [CHANGE_TIME_HEAD]: {
        accepts: (action: AnyAction): action is ChangeTimeAction =>
            action.type === CHANGE_TIME_HEAD,
        perform: (state: SelectionStateBranch, action: ChangeTimeAction) => ({
            ...state,
            time: action.payload,
        }),
    },
    [SIDE_PANEL_COLLAPSED]: {
        accepts: (
            action: AnyAction
        ): action is ChangeNumberCollapsedPanelsAction =>
            action.type === SIDE_PANEL_COLLAPSED,
        perform: (
            state: SelectionStateBranch,
            action: ChangeNumberCollapsedPanelsAction
        ) => ({
            ...state,
            numberPanelsCollapsed: state.numberPanelsCollapsed + action.payload,
        }),
    },
    [HIGHLIGHT_AGENT]: {
        accepts: (action: AnyAction): action is HighlightAgentAction =>
            action.type === HIGHLIGHT_AGENT,
        perform: (
            state: SelectionStateBranch,
            action: HighlightAgentAction
        ) => ({
            ...state,
            hightlightedId: action.payload,
        }),
    },
    [HIGHLIGHT_AGENTS_BY_NAME]: {
        accepts: (
            action: AnyAction
        ): action is ChangeAgentsRenderingStateAction =>
            action.type === HIGHLIGHT_AGENTS_BY_NAME,
        perform: (
            state: SelectionStateBranch,
            action: HighlightAgentAction
        ) => ({
            ...state,
            highlightedAgentNames: action.payload,
        }),
    },
    [TOGGLE_LOAD_FILE_MODAL]: {
        accepts: (action: AnyAction): action is ToggleAction =>
            action.type === TOGGLE_LOAD_FILE_MODAL,
        perform: (
            state: SelectionStateBranch,
            action: HighlightAgentAction
        ) => ({
            ...state,
            modalOpen: action.payload,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
