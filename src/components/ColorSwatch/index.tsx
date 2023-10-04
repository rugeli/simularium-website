import * as React from "react";
import { useState } from "react";

import ColorPicker from "../ColorPicker";

import styles from "./styles.css";
import { ColorChangesMap } from "../../state/selection/types";
interface ColorSwatchProps {
    childrenHaveDifferentColors?: boolean;
    color: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    setColorInfoFromPicker: (
        colorChanges?: ColorChangesMap,
        recentColors?: string[]
    ) => void;
}

const ColorSwatch = ({
    childrenHaveDifferentColors,
    color,
    agentName,
    tags,
    recentColors,
    setColorInfoFromPicker,
}: ColorSwatchProps): JSX.Element => {
    const [isColorPickerVisible, setColorPickerVisible] = useState(false);
    const [initialColor, setInitialColor] = useState(color);

    const closeModal = () => {
        setColorPickerVisible(false);
    };

    const openModal = () => {
        setInitialColor(color);
        setColorPickerVisible(true);
    };

    // could move these rules into the css sheet, but to get color from prop
    // and apply rules conditionlly means there will be soe inline styling
    // figured its more clean to have it all visible here rather than some here and some in stylesheet
    const style = childrenHaveDifferentColors
        ? { border: "1px solid #d3d3d3" }
        : { backgroundColor: color };

    return (
        <>
            <div
                className={styles.container}
                style={style}
                onClick={() => {
                    openModal();
                }}
            />
            <ColorPicker
                agentName={agentName}
                tags={tags}
                oldColor={initialColor}
                isOpen={isColorPickerVisible}
                closeModal={closeModal}
                recentColors={recentColors}
                setColorInfoFromPicker={setColorInfoFromPicker}
            />
        </>
    );
};

export default ColorSwatch;
