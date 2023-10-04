import React, { useEffect, useState } from "react";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";

import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import { ColorChangesMap } from "../../state/selection/types";

import styles from "./style.css";
interface ColorPickerProps {
    oldColor: string;
    agentName: string;
    tags: string[];
    isOpen: boolean;
    closeModal: () => void;
    recentColors: string[];
    setColorInfoFromPicker: (
        colorChanges?: ColorChangesMap,
        recentColors?: string[]
    ) => void;
}

const ColorPicker = ({
    oldColor,
    agentName,
    tags,
    isOpen,
    closeModal,
    recentColors,
    setColorInfoFromPicker,
}: ColorPickerProps) => {
    const [color, setColor] = useState(oldColor);

    const handleColorChange = (color: string) => {
        const colorChanges: ColorChangesMap = {
            agents: { [agentName]: tags },
            color: color,
        };
        setColorInfoFromPicker(colorChanges);
        updateRecentColors(color);
    };

    useEffect(() => {
        handleColorChange(color);
    }, [color]);

    const updateRecentColors = (color: string) => {
        if (recentColors.includes(color)) {
            return;
        }
        const newRecentColors = [color, ...recentColors];
        if (newRecentColors.length > 18) {
            newRecentColors.pop();
        }
        setColorInfoFromPicker(undefined, newRecentColors);
    };

    const colorPickerContent = (
        <div className={styles.container}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.oldColor}
                        style={{ backgroundColor: oldColor }}
                        onClick={() => {
                            setColor(oldColor);
                        }}
                    >
                        {" "}
                    </div>
                    <p> CURRENT </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.newColor}
                        style={{ backgroundColor: color }}
                    >
                        {" "}
                    </div>
                    <p> NEW </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <HexColorInput
                        className={styles.hexInput}
                        color={color}
                        onChange={setColor}
                    />
                    <p> HEX </p>
                </div>
            </div>
            <div
                className={classNames([
                    styles.colors,
                    styles.agentColorsSwatches,
                ])}
            >
                {AGENT_COLORS.map((color) => (
                    <Tooltip
                        key={color}
                        align={{ offset: [2, 5] }}
                        color="#69738A"
                        overlayClassName={styles.tooltip}
                        title={color.slice(1)}
                    >
                        <button
                            key={color}
                            className={classNames([
                                styles.swatch,
                                styles.pickerSwatch,
                            ])}
                            style={{ background: color }}
                            onClick={() => setColor(color)}
                        />
                    </Tooltip>
                ))}
            </div>
            <p className={styles.recentColorText}> Recent </p>
            <div className={classNames([styles.colors, styles.recentSwatches])}>
                {recentColors.map((color: string) => (
                    <button
                        key={color}
                        className={classNames([
                            styles.swatch,
                            styles.recentSwatch,
                        ])}
                        style={{ background: color }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <Popover
            overlayClassName={styles.popover}
            open={isOpen}
            content={colorPickerContent}
            placement="right"
            onOpenChange={closeModal}
            trigger="click"
        />
    );
};

export default ColorPicker;
