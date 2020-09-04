import * as React from "react";
import { Layout, Row, Col, Button, PageHeader } from "antd";
import { ActionCreator } from "redux";

import { ToggleAction } from "../../state/selection/types";
import FileUpload from "../FileUpload";
import { MetadataStateBranch } from "../../state/metadata/types";
const { Header } = Layout;

const styles = require("./style.css");

interface AppHeaderProps {
    openLoadFileModal: ActionCreator<ToggleAction>;
    modalOpen: boolean;
    loadLocalFile: () => void;
    saveLocalSimulariumFile: ActionCreator<MetadataStateBranch>;
    simulariumFileName: string;
}
export default class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const {
            openLoadFileModal,
            loadLocalFile,
            simulariumFileName,
            saveLocalSimulariumFile,
        } = this.props;
        return (
            <Header className={styles.container}>
                <PageHeader
                    title="Simularium"
                    subTitle={simulariumFileName ? simulariumFileName : ""}
                    extra={[
                        <Button
                            key="open"
                            type="primary"
                            onClick={openLoadFileModal}
                        >
                            Load Existing Simulation
                        </Button>,
                        <FileUpload
                            key="upload"
                            loadLocalFile={loadLocalFile}
                            saveLocalSimulariumFile={saveLocalSimulariumFile}
                        />,
                    ]}
                />
                <Row>
                    <Col />
                    <Col />
                    <Col />
                </Row>
            </Header>
        );
    }
}
