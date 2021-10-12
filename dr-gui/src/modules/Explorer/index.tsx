import React from 'react';

import FilePathProvider from '../../context/FilepathContext';

import {PathFinder, InfoBox} from "../../components";


export const Explorer = ({}) => {

    return <FilePathProvider>
        <PathFinder/>
        <InfoBox>
            Then click a docker-compose file that is within your directory of microservices.
        </InfoBox>
    </FilePathProvider>;
}