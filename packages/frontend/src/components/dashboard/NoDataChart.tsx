/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled, Typography } from "@mui/material";

import { useTranslate } from "@/hooks/useTranslate";
import { SXStyleOptions } from "@/utils/SXStyleOptions";

export const StyledMessage = styled(Typography)(
  SXStyleOptions({
    color: "grey.400",
    fontSize: "body1.fontSize",
    fontWeight: "700",
    display: "block",
    margin: 0,
  }),
);

export const NoDataChart = () => {
  const { t } = useTranslate();

  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <StyledMessage style={{ marginBottom: "0.5rem" }}>
        <FontAwesomeIcon icon={faChartLine} size="2x" />
      </StyledMessage>
      <StyledMessage style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
        {t("charts.no_data")}
      </StyledMessage>
      <Typography variant="body2" color="grey.500">
        {t("charts.no_data_hint")}
      </Typography>
    </div>
  );
};
