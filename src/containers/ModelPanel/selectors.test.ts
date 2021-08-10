import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";

const mockUiDisplayData = [
    {
        title: "agentWithChildren1",
        key: "agentWithChildren1",
        children: [
            {
                label: "<unmodified>",
                value: "",
            },
            {
                label: "state1",
                value: "state1",
            },
        ],
    },
    {
        title: "agentWithChildren2",
        key: "agentWithChildren2",
        children: [
            {
                label: "<unmodified>",
                value: "",
            },
            {
                label: "state1",
                value: "state1",
            },
        ],
    },
    {
        title: "agentWithoutChildren",
        key: "agentWithoutChildren",
        children: [],
    },
];

describe("ModelPanel selectors", () => {
    describe("getSelectAllVisibilityMap", () => {
        it("Returns an agent visibility map with all possible states", () => {
            const result = getSelectAllVisibilityMap.resultFunc(
                mockUiDisplayData
            );
            const expected = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getSelectNoneVisibilityMap", () => {
        it("Returns an agent visibility map with none of the possible states", () => {
            const result = getSelectNoneVisibilityMap.resultFunc(
                mockUiDisplayData
            );
            const expected = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getIsSharedCheckboxIndeterminate", () => {
        it("Returns true if an agent has children in indeterminate state", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: [""],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent with display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: [],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent without display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns false if all states of all agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Returns false if all states of all agents are invisible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Returns false if no visibility information is supplied", () => {
            const mockAgentVisibilityMap = {};
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Instead of crashing, skips a check for an agent if it is missing from agentVisibilityMap for some reason", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                // Missing "agentWithoutChildren"
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
    });
});
