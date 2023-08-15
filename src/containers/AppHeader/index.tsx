import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import {
    ClearSimFileDataAction,
    ConvertFileAction,
    isLocalFileInterface,
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
} from "../../state/trajectory/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import ViewerTitle from "../../components/ViewerTitle";
import HelpMenu from "../../components/HelpMenu";
import { AicsLogo } from "../../components/Icons";
import { State } from "../../state/types";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    SetViewerStatusAction,
    SetErrorAction,
    ViewerStatus,
} from "../../state/viewer/types";

import styles from "./style.css";
import DownloadTrajectoryMenu from "../../components/DownloadTrajectoryMenu";

interface AppHeaderProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
    isBuffering: boolean;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
    convertFile: ActionCreator<ConvertFileAction>;
    viewerStatus: ViewerStatus;
}

class AppHeader extends React.Component<AppHeaderProps> {
    public render(): JSX.Element {
        const {
            simulariumFile,
            isBuffering,
            changeToLocalSimulariumFile: loadLocalFile,
            changeToNetworkedFile: loadNetworkFile,
            convertFile,
            setViewerStatus,
            clearSimulariumFile,
            setError,
            viewerStatus,
        } = this.props;
        let lastModified = 0;
        let displayName = "";
        if (isLocalFileInterface(simulariumFile)) {
            displayName = simulariumFile.name;
            lastModified = simulariumFile.lastModified;
        } else if (isNetworkSimFileInterface(simulariumFile)) {
            displayName = simulariumFile.title;
        }
        return (
            <div className={styles.pageHeader}>
                <div className={styles.leftLinks}>
                    <a href="https://allencell.org" title="Allen Cell Explorer">
                        {AicsLogo}
                    </a>
                    <span className={styles.verticalBar}>|</span>
                    <Link to="/" className={styles.simulariumHome}>
                        SIMULARIUM HOME
                    </Link>
                </div>
                <ViewerTitle
                    simulariumFileName={displayName}
                    lastModified={lastModified}
                />
                <div className={styles.buttons}>
                    <LoadFileMenu
                        key="select"
                        selectFile={loadNetworkFile}
                        clearSimulariumFile={clearSimulariumFile}
                        loadLocalFile={loadLocalFile}
                        setViewerStatus={setViewerStatus}
                        isBuffering={isBuffering}
                        setError={setError}
                        initializeFileConversionUI={convertFile}
                        viewerStatus={viewerStatus}
                    />
                    <HelpMenu key="help" />
                    <div className={styles.pipe}>|</div>
                    <DownloadTrajectoryMenu
                        isBuffering={isBuffering}
                        simulariumFile={simulariumFile}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        simulariumFile:
            trajectoryStateBranch.selectors.getSimulariumFile(state),
        isBuffering: viewerStateBranch.selectors.getIsBuffering(state),
        viewerStatus: viewerStateBranch.selectors.getStatus(state),
    };
}

const dispatchToPropsMap = {
    changeToLocalSimulariumFile:
        trajectoryStateBranch.actions.changeToLocalSimulariumFile,
    changeToNetworkedFile: trajectoryStateBranch.actions.changeToNetworkedFile,
    clearSimulariumFile: trajectoryStateBranch.actions.clearSimulariumFile,
    setViewerStatus: viewerStateBranch.actions.setStatus,
    setError: viewerStateBranch.actions.setError,
    convertFile: trajectoryStateBranch.actions.convertFile,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AppHeader);
