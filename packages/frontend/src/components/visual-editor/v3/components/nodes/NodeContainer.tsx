/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import clsx from "clsx";
import { PropsWithChildren } from "react";

import { useNode } from "../../hooks/useNode";

export const NodeContainer = ({ children }: PropsWithChildren) => {
  const { config } = useNode();

  return (
    <div
      className={clsx("custom-node")}
      style={{
        border: `1px solid ${config.color}`,
      }}
    >
      {children}
    </div>
  );
};
