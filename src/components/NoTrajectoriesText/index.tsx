import * as React from "react";
import { Link } from "react-router-dom";

import { TUTORIAL_PATHNAME } from "../../routes";
import { EXAMPLE_TRAJECTORY_URL } from "../../constants";

const styles = require("./style.css");

const NoTrajectoriesText: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <h3>No trajectories loaded</h3>
            <p>
                To view a simulation, either{" "}
                <a href={EXAMPLE_TRAJECTORY_URL}>download</a> our example data
                or{" "}
                <a
                    href={`${TUTORIAL_PATHNAME}#convert-your-data`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    convert
                </a>{" "}
                your own data, then drag and drop it onto this window.
            </p>
            <p>
                <Link
                    to={TUTORIAL_PATHNAME}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get started here.
                </Link>
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
