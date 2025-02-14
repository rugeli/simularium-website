import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { Dropdown, Button, MenuProps } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    ClearSimFileDataAction,
    ConversionStatus,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetConversionStatusAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";
import {
    CONVERSION_INACTIVE,
    CONVERSION_NO_SERVER,
} from "../../state/trajectory/constants";
import { ButtonClass, TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import { DownArrow } from "../Icons";
import FileUploadModal from "../FileUploadModal";
import NavButton from "../NavButton";

import styles from "./style.css";

interface LoadFileMenuProps {
    isBuffering: boolean;
    selectFile: ActionCreator<RequestNetworkFileAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
}

const LoadFileMenu = ({
    clearSimulariumFile,
    isBuffering,
    loadLocalFile,
    selectFile,
    setViewerStatus,
    setError,
    conversionStatus,
    setConversionStatus,
}: LoadFileMenuProps): JSX.Element => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const showModal = () => {
        if (history.location.pathname !== VIEWER_PATHNAME) {
            history.push(VIEWER_PATHNAME);
        }
        setIsModalVisible(true);
    };

    const openConversionForm = () => {
        setConversionStatus({ status: CONVERSION_NO_SERVER });
    };

    const onClick = (trajectoryData: TrajectoryDisplayData) => {
        if (location.pathname === VIEWER_PATHNAME) {
            selectFile({
                name: trajectoryData.id,
                title: trajectoryData.title,
            });
        }
    };

    const items: MenuProps["items"] = [
        {
            key: "from-examples",
            label: "Example models",
            popupClassName: styles.submenu,
            popupOffset: [-0.45, -4],
            children: TRAJECTORIES.map((trajectory) => ({
                key: trajectory.id,
                label: (
                    <Link
                        onClick={() => onClick(trajectory)}
                        to={{
                            pathname: VIEWER_PATHNAME,
                            search: `?${URL_PARAM_KEY_FILE_NAME}=${trajectory.id}`,
                        }}
                    >
                        {trajectory.title}
                        {trajectory.subtitle && `: ${trajectory.subtitle}`}
                    </Link>
                ),
            })),
        },
        {
            key: "file-upload",
            label: (
                <Button type="ghost" onClick={showModal}>
                    Simularium file
                </Button>
            ),
        },
        {
            key: "file-convert",
            label: (
                <Link
                    onClick={openConversionForm}
                    to={{ pathname: VIEWER_PATHNAME }}
                >
                    Import other file type
                </Link>
            ),
        },
    ];

    const isDisabled = isBuffering || conversionStatus !== CONVERSION_INACTIVE;

    return (
        <>
            <Dropdown
                menu={{ items, theme: "dark", className: styles.menu }}
                placement="bottomRight"
                disabled={isDisabled}
            >
                <NavButton
                    titleText={"Load model"}
                    icon={DownArrow}
                    buttonType={ButtonClass.Primary}
                    isDisabled={isDisabled}
                />
            </Dropdown>
            {/* 
                Conditionally rendering the modal this way instead of as a `visible` prop
                forces it to re-render every time it is opened, resetting the form inside.
            */}
            {isModalVisible && (
                <FileUploadModal
                    setIsModalVisible={setIsModalVisible}
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={loadLocalFile}
                    setViewerStatus={setViewerStatus}
                    setError={setError}
                />
            )}
        </>
    );
};

export default LoadFileMenu;
