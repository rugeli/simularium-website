import React, { useEffect, useState } from "react";
import { Upload, Select, Divider, Button } from "antd";
import classNames from "classnames";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import theme from "../../components/theme/light-theme.css";
import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import simulariumStateBranch from "../../state/simularium";
import viewerStateBranch from "../../state/viewer";
import {
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
} from "../../state/trajectory/types";
import {
    AvailableEngines,
    ExtensionMap,
    Template,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";

import styles from "./style.css";
import customRequest from "./custom-request";
import { SetErrorAction } from "../../state/viewer/types";
import { UploadFile } from "antd/lib/upload";
import ConversionServerCheckModal from "../../components/ConversionServerCheckModal";
import { SimulariumController } from "@aics/simularium-viewer";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import ConversionFileErrorModal from "../../components/ConversionFileErrorModal";
import { NetConnectionParams } from "@aics/simularium-viewer/type-declarations/simularium";

// TODO QUESTIONS
// Currently sending one request on page load and another request on file upload... sufficient?
// I'm using Date.now() to generate a request ID, there are libraries like nanoid or uuid but i dont want to add unneeded dependencies
// 15 second time out for health check responses, is that too long?

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
    conversionProcessingData: {
        template: Template;
        templateMap: TemplateMap;
        fileToConvert: string;
        engineType: AvailableEngines;
    };
    receiveFileToConvert: ActionCreator<ReceiveFileToConvertAction>;
    setError: ActionCreator<SetErrorAction>;
    simulariumController: SimulariumController;
}

interface HealthCheckTimeouts {
    [requestId: number]: NodeJS.Timeout;
}

const validFileExtensions: ExtensionMap = {
    // TODO: update this with correct extensions
    Smoldyn: "txt",
    cytosim: "txt",
    cellPACK: "txt",
    SpringSaLaD: "txt",
};

const selectOptions = Object.keys(AvailableEngines).map(
    (engineName: string, index) => {
        const values = Object.values(AvailableEngines);
        return {
            label: engineName,
            value: values[index],
        };
    }
);

// possible to arrive here without configuring a controller
// so we need this config to send a health check
const netConnectionConfig: NetConnectionParams = {
    serverIp: "0.0.0.0",
    serverPort: 8765,
    useOctopus: true,
    secureConnection: false,
};

const ConversionForm = ({
    setConversionEngine,
    conversionProcessingData,
    setError,
    receiveFileToConvert,
    simulariumController,
}: ConversionProps): JSX.Element => {
    const [serverHealth, setServerHealth] = useState<boolean>(false);
    const [engineSelected, setEngineSelected] = useState<boolean>(false);
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    const [serverDownModalOpen, setServerIsDownModalOpen] =
        useState<boolean>(false);
    const [fileTypeErrorModalOpen, setFileTypeErrorModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const readyToConvert = fileToConvert && engineSelected;

    // TODO is it necessary to check if existing controller is not RemoteSimulator?
    const controller =
        simulariumController ||
        new SimulariumController({
            netConnectionSettings: netConnectionConfig,
        });

    const healthCheckTimeouts: HealthCheckTimeouts = {};
    let healthCheckInterval: NodeJS.Timeout | null = null;

    // will use this interval to send health checks every 15 seconds if one fails
    const setHealthCheckInterval = () => {
        if (healthCheckInterval) {
            clearInterval(healthCheckInterval);
        }
        healthCheckInterval = setInterval(sendHealthCheck, 15000);
    };

    const generateRequestId = () => {
        return Date.now();
    };

    // sends a health check and sets initial 15 second timeout
    const sendHealthCheck = () => {
        const requestId = generateRequestId();
        controller.checkServerHealth(
            () => onHealthCheckResponse(requestId),
            netConnectionConfig
        );

        healthCheckTimeouts[requestId] = setTimeout(() => {
            // no response received in time
            if (healthCheckTimeouts[requestId]) {
                setServerHealth(false);
                delete healthCheckTimeouts[requestId];
                // Start interval checks only if not already started
                if (!healthCheckInterval) {
                    setHealthCheckInterval();
                }
            }
        }, 15000);
    };

    // callback for viewer
    // sets server health state, clears timeouts and intervals
    const onHealthCheckResponse = (requestId: number): void => {
        setServerHealth(true);

        if (healthCheckTimeouts[requestId]) {
            clearTimeout(healthCheckTimeouts[requestId]);
            delete healthCheckTimeouts[requestId];
        }

        // Stop the interval checks as server is healthy
        if (healthCheckInterval) {
            clearInterval(healthCheckInterval);
            healthCheckInterval = null;
        }
    };

    // On load, configure controller and send request
    useEffect(() => {
        sendHealthCheck();
    }, []);

    // useEffect to log a change in server health
    useEffect(() => {
        console.log(
            "localServerHealth",
            serverHealth,
            "netConnectionConfig",
            netConnectionConfig
        );
    }, [serverHealth]);

    // callback for modal to use
    const toggleServerCheckModal = () => {
        setServerIsDownModalOpen(!serverDownModalOpen);
    };

    const toggleFileTypeModal = () => {
        setFileTypeErrorModalOpen(!fileTypeErrorModalOpen);
    };
    const toggleProcessing = () => {
        setIsProcessing(!isProcessing);
    };

    const handleEngineChange = (selectedValue: string) => {
        const selectedEngine = selectedValue as AvailableEngines;
        setConversionEngine(selectedEngine);
        setEngineSelected(true);
    };

    // we sent one health check on page load
    // that might have been a while ago, lets send another
    const handleFileSelection = async (file: UploadFile) => {
        sendHealthCheck();
        setFileToConvert(file);
    };

    const validateFileType = (fileName: string) => {
        const fileExtension = fileName.split(".").pop();
        if (fileExtension) {
            if (
                validFileExtensions[conversionProcessingData.engineType] ===
                fileExtension.toLowerCase()
            ) {
                return true;
            }
        }
        setFileTypeErrorModalOpen(true);
        return false;
    };

    const advanceIfServerIsHealthy = () => {
        if (readyToConvert && validateFileType(fileToConvert.name)) {
            if (!serverHealth) {
                setServerIsDownModalOpen(true);
            } else {
                // at this point: engine selected, file uploaded, file type valid, server health received
                setIsProcessing(true);
            }
        }
    };

    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);

    const conversionForm = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            {serverDownModalOpen && (
                <ConversionServerCheckModal
                    closeModal={toggleServerCheckModal}
                />
            )}
            {fileTypeErrorModalOpen && (
                <ConversionFileErrorModal
                    closeModal={toggleFileTypeModal}
                    engineType={conversionProcessingData.engineType}
                />
            )}
            {isProcessing && (
                <ConversionProcessingOverlay
                    toggleProcessing={toggleProcessing}
                    fileName={fileToConvert ? fileToConvert?.name : null}
                />
            )}
            <div className={styles.formContent}>
                <h3 className={styles.title}>Import a non-native file type</h3>
                <h3>
                    Convert and import a non-simularium file by providing the
                    following information
                </h3>
                <h3 className={styles.sectionHeader}>
                    {" "}
                    Provide file information (required){" "}
                </h3>
                <h3 className={styles.selectTitle}>Simulation Engine</h3>
                <div className={styles.uploadContainer}>
                    <Select
                        className={styles.selectorBox}
                        bordered={true}
                        defaultValue="Select"
                        options={selectOptions}
                        onChange={(selectedValue) => {
                            handleEngineChange(selectedValue);
                        }}
                    />
                    <Upload
                        className={styles.upload}
                        listType="text"
                        multiple={false}
                        fileList={fileToConvert ? [fileToConvert] : []}
                        showUploadList={{
                            showPreviewIcon: false,
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                        }}
                        onChange={({ file }) => {
                            handleFileSelection(file);
                        }}
                        customRequest={(options) =>
                            customRequest(
                                fileToConvert,
                                receiveFileToConvert,
                                setError,
                                options
                            )
                        }
                    >
                        <Button type="default">Select file</Button>
                    </Upload>
                </div>
                <Divider orientation="right" orientationMargin={400}>
                    {" "}
                </Divider>
                <Button ghost>Cancel</Button>
                <Button
                    type="primary"
                    disabled={!readyToConvert}
                    onClick={advanceIfServerIsHealthy}
                >
                    Next
                </Button>
            </div>
        </div>
    );

    return conversionForm;
};

function mapStateToProps(state: State) {
    return {
        conversionProcessingData:
            trajectoryStateBranch.selectors.getConversionProcessingData(state),
        simulariumController:
            simulariumStateBranch.selectors.getSimulariumController(state),
    };
}

const dispatchToPropsMap = {
    receiveFileToConvert: trajectoryStateBranch.actions.receiveFileToConvert,
    setError: viewerStateBranch.actions.setError,
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
    setSimulariumController:
        simulariumStateBranch.actions.setSimulariumController,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
