import React, { useState } from "react";
import { Checkbox, Collapse, Col, Row } from "antd";
import { ActionCreator } from "redux";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { map } from "lodash";

import {
    ChangeAgentsRenderingStateAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import SharedCheckbox from "../SharedCheckbox";
const { Panel } = Collapse;

const CheckboxGroup = Checkbox.Group;

export interface AgentDisplayNode {
    title: string;
    key: string;
    children: CheckboxOptionType[];
}

interface CheckBoxTreeProps {
    treeData: AgentDisplayNode[];
    agentsChecked: VisibilitySelectionMap;
    agentsHighlighted: VisibilitySelectionMap;
    handleAgentCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    handleHighlight: ActionCreator<ChangeAgentsRenderingStateAction>;
    title: string;
}

const CheckBoxTree = ({
    agentsChecked,
    agentsHighlighted,
    treeData,
    handleAgentCheck,
    handleHighlight,
    title,
}: CheckBoxTreeProps) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand = (expandedKeys: (string | number)[]) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys as string[]);
        setAutoExpandParent(false);
    };

    const onSubCheckboxChange = (key: string, values: string[]) => {
        handleAgentCheck({ [key]: values });
    };

    const onSubHighlightChange = (key: string, values: string[]) => {
        handleHighlight({ [key]: values });
    };

    const onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        handleAgentCheck(checkedKeys);
    };

    const onTopLevelHighlightChange = (checkedKeys: {
        [key: string]: string[];
    }) => {
        handleHighlight(checkedKeys);
    };

    const onAgentWithNoTagsChange = (
        event: CheckboxChangeEvent,
        title: string
    ) => {
        event.preventDefault();
        if (event.target.checked) {
            onSubCheckboxChange(title, [title]);
        } else {
            onSubCheckboxChange(title, []);
        }
    };
    console.log("AGENTS CHECKED", agentsChecked);
    return treeData.length > 0 ? (
        <>
            <label>{title}</label>
            <Collapse defaultActiveKey={expandedKeys}>
                {treeData.map((data) => {
                    return (
                        <Panel
                            header={
                                data.children.length ? (
                                    <>
                                        <SharedCheckbox
                                            title={data.title}
                                            options={map(
                                                data.children,
                                                "value" as string
                                            )}
                                            onTopLevelCheck={
                                                onTopLevelHighlightChange
                                            }
                                            checkedList={
                                                agentsHighlighted[data.title] ||
                                                []
                                            }
                                        />
                                        <SharedCheckbox
                                            title={data.title}
                                            options={map(
                                                data.children,
                                                "value" as string
                                            )}
                                            onTopLevelCheck={onTopLevelCheck}
                                            checkedList={
                                                agentsChecked[data.title] || []
                                            }
                                        />
                                    </>
                                ) : (
                                    <Checkbox
                                        onChange={(event) =>
                                            onAgentWithNoTagsChange(
                                                event,
                                                data.title
                                            )
                                        }
                                    >
                                        {data.title}
                                    </Checkbox>
                                )
                            }
                            key={data.key}
                        >
                            <Row>
                                <Col>
                                    <CheckboxGroup
                                        options={data.children}
                                        value={agentsChecked[data.title] || []}
                                        onChange={(values) =>
                                            onSubCheckboxChange(
                                                data.title,
                                                values as string[]
                                            )
                                        }
                                    />
                                </Col>
                                <Col>
                                    <CheckboxGroup
                                        options={data.children}
                                        value={
                                            agentsHighlighted[data.title] || []
                                        }
                                        onChange={(values) =>
                                            onSubHighlightChange(
                                                data.title,
                                                values as string[]
                                            )
                                        }
                                    />
                                </Col>
                            </Row>
                        </Panel>
                    );
                })}
            </Collapse>
        </>
    ) : (
        <div>Load file</div>
    );
};

export default CheckBoxTree;
