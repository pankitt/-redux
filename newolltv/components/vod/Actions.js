import React from 'react';

export default function Actions() {
    return (
        <div className="actions">
            <div className="left">
                <div className="btn icon like active"></div>
                <div className="btn icon dislike"></div>
            </div>
            <div className="right">
                <div className="btn icon parental"></div>
                <div className="btn icon favourite"></div>
            </div>
        </div>
    );
}
