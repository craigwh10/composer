import React, { useState } from 'react';
import EventNames from '../../shared/EventNames'

const { ipcRenderer } = window.require("electron");

export const PathFinder = ({}) => {
    const [filePath, setFilePath] = useState<string>('');

    return (
        <>
            <button type="button" value="Select File" onClick={() => handlePathSelectPress(setFilePath)}>
                Select File
            </button>
        </>
    )
}

const handlePathSelectPress = async (setFilePath: React.Dispatch<string>) => {
    const result = await ipcRenderer.invoke(EventNames.OPEN_PATH_FINDER);

    setFilePath(result);
}