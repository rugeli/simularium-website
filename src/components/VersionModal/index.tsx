import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";

interface VersionModalProps {
    setModalVisible: (isModalVisible: boolean) => void;
}

const VersionModal: React.FC<VersionModalProps> = ({ setModalVisible }) => {
    const closeModal = () => {
        setModalVisible(false);
    };

    const footerButton = (
        <Button type="default" onClick={closeModal}>
            Close
        </Button>
    );

    return (
        <CustomModal
            closeHandler={closeModal}
            titleText="Version Information"
            className={styles.version}
            onCancel={closeModal}
            open
            footerButtons={footerButton}
            centered
            width={425}
        >
            <div>
                Application:
                <span className={styles.blueText}>
                    simularium-website v{SIMULARIUM_WEBSITE_VERSION}
                </span>
            </div>
            <div>
                Viewer:
                <span className={styles.blueText}>
                    simularium-viewer v{SIMULARIUM_VIEWER_VERSION}
                </span>
            </div>
        </CustomModal>
    );
};

export default VersionModal;
