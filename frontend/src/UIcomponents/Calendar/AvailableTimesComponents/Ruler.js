/*
this class is copied from project react-available-times
like: https://github.com/trotzig/react-available-times/
 */

import PropTypes from 'prop-types';
import React from 'react';

import { HOUR_IN_PIXELS, RULER_WIDTH_IN_PIXELS } from './Constants';
import HelpFunctionCollections from './HelpFunctionCollections';
import styles from './Ruler.css';

export default function Ruler({ timeConvention }) {
    return (
        <div
            className={styles.component}
            style={{ width: RULER_WIDTH_IN_PIXELS }}
        >
            {HelpFunctionCollections.hours(timeConvention).map(hour => (
                <div
                    key={hour}
                    className={styles.hour}
                    style={{ height: HOUR_IN_PIXELS }}
                >
                    <div className={styles.inner}>
                        {hour !== '00' && hour !== '12am' ? hour : null}
                    </div>
                </div>
            ))}
        </div>
    );
}
Ruler.propTypes = {
    timeConvention: PropTypes.oneOf(['12h', '24h']),
};