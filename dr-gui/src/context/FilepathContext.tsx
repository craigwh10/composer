import React, {useState, createContext} from 'react';
import type {Dispatch, SetStateAction} from 'react';

const context = createContext< {
    filePath: string | null,
    setFilePath: Dispatch<SetStateAction<string | null>>
}>({
    filePath: null,
    setFilePath: () => {}
});

export function getFileProviderContext() {
    return context;
}

export default function FilepathProvider(props: any) {
    const {Provider}= getFileProviderContext();
    const {children} = props;

    const [filePath, setFilePath] = useState<string | null>(null);

    return (
        <Provider
            value={{
                filePath,
                setFilePath
            }}
        >
            {children}
        </Provider>
    );
}
