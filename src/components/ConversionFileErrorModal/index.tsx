import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";
import { AvailableEngines } from "../../state/trajectory/conversion-data-types";

import styles from "./style.css";

interface ConversionFileErrorModalProps {
    closeModal: () => void;
    engineType: AvailableEngines;
}

const ConversionFileErrorModal: React.FC<ConversionFileErrorModalProps> = ({
    closeModal,
    engineType,
}) => {
    const footerButton = (
        <Button type="primary" onClick={closeModal}>
            OK
        </Button>
    );

    return (
        <CustomModal
            className={styles.errorModal}
            title="File import cannot be completed"
            open
            footer={footerButton}
            width={426}
            centered
            onCancel={closeModal}
        >
            <div>
                <p className={styles.warningText}>
                    {"We're sorry, there was a problem importing your file."}
                </p>
                <p>
                    You may want to double check that the file you selected is a
                    valid {engineType} file and try again. For further
                    assistance, please visit
                </p>
                <a
                    href="https://forum.allencell.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    The Allen Cell Discussion Forum.
                </a>
            </div>
        </CustomModal>
    );
};

export default ConversionFileErrorModal;
