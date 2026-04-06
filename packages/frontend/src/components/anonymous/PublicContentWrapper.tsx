/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { CircularProgress, Grid } from "@mui/material";
import { FC } from "react";

import { useAuth } from "@/hooks/useAuth";

export type PublicContentWrapperProps = { children: React.ReactNode };
export const PublicContentWrapper: FC<PublicContentWrapperProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
        p: 3,
      }}
    >
      {isAuthenticated ? <CircularProgress /> : children}
    </Grid>
  );
};
