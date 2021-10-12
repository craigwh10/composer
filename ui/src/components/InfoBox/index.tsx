import React from "react";

import type { ReactElement } from "react";

interface InfoBoxProps {
  children: string;
  type?: "info";
}

export const InfoBox = ({
  children: content,
  type,
}: InfoBoxProps): ReactElement => {
  return (
    <div
      className={`infobox-${type}`}
      data-testid={`infobox-${type}-${content.substring(0, 5)}`}
    >
      {content}
    </div>
  );
};
