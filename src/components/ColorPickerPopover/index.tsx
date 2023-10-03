import React from "react";
import { Popover } from "antd";
import ColorPicker from "../ColorPicker";

import styles from "./style.css";

interface ColorPickerPopoverProps {
    oldColor: string;
    isOpen: boolean;
    closeModal: () => void;
    agentName: string;
    tags: string[];
    colorInfoForPicker: any; // TODO: type this
}

const ColorPickerPopover = ({
    oldColor,
    isOpen,
    closeModal,
    agentName,
    tags,
    colorInfoForPicker,
}: ColorPickerPopoverProps) => {
    return (
        <Popover
            overlayClassName={styles.popover}
            open={isOpen}
            content={
                <ColorPicker
                    agentName={agentName}
                    tags={tags}
                    oldColor={oldColor}
                    colorInfoForPicker={colorInfoForPicker}
                />
            }
            placement="right"
            onOpenChange={closeModal}
            trigger="click"
        />
    );
};
export default ColorPickerPopover;
