/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import KeyIcon from "@mui/icons-material/Key";
import { Button, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useResetPassword } from "@/hooks/entities/reset-hooks";
import { useToast } from "@/hooks/useToast";
import { useTranslate } from "@/hooks/useTranslate";
import { useValidationRules } from "@/hooks/useValidationRules";

import { PublicContentWrapper } from "../../components/anonymous/PublicContentWrapper";
import { ContentContainer } from "../dialogs";
import { Adornment } from "../inputs/Adornment";
import { PasswordInput } from "../inputs/PasswordInput";

export const ResetPassword = () => {
  const { t } = useTranslate();
  const { toast } = useToast();
  const rules = useValidationRules();
  const validationRules = {
    password: {
      ...rules.password,
      required: t("message.password_is_required"),
    },
    password2: {
      ...rules.password2,
      required: t("message.password_is_required"),
    },
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; password2: string }>({
    defaultValues: { password: "", password2: "" },
  });
  const { query, replace } = useRouter();
  // the following typecasting is due to the fact that the query object is not typed
  const { mutate: resetPassword } = useResetPassword(query.token as string, {
    onSuccess: () => {
      toast.success(t("message.reset_newpass_success"));
      replace("/login");
    },
    onError: () => {
      toast.error(t("message.server_error"));
    },
  });

  return (
    <PublicContentWrapper>
      <Paper
        sx={{
          width: { xs: "100%", sm: "85%", md: "420px" },
          p: 4,
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)",
          borderRadius: "24px",
        }}
      >
        <form
          onSubmit={handleSubmit((payload) => {
            resetPassword(payload);
          })}
        >
          <ContentContainer gap={3}>
            <Typography variant="h1" fontSize="28px" fontWeight={700} textAlign="center" sx={{ mb: 0.5 }}>
              {t("title.reset_password")}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Set your new password below
            </Typography>
            <PasswordInput
              autoFocus
              label={t("label.password")}
              error={!!errors.password}
              required
              InputProps={{
                startAdornment: <Adornment Icon={KeyIcon} />,
              }}
              helperText={errors.password ? errors.password.message : null}
              {...register("password", validationRules.password)}
            />

            <PasswordInput
              label={t("placeholder.password2")}
              error={!!errors.password2}
              required
              InputProps={{
                startAdornment: <Adornment Icon={KeyIcon} />,
              }}
              helperText={errors.password2 ? errors.password2.message : null}
              {...register("password2", validationRules.password2)}
            />
            <Grid container gap={2} justifyContent="flex-end">
              <Button type="submit" sx={{ px: 4 }}>{t("button.submit")}</Button>
              <Link href="/login">
                <Button variant="outlined">{t("button.cancel")}</Button>
              </Link>
            </Grid>
          </ContentContainer>
        </form>
      </Paper>
    </PublicContentWrapper>
  );
};
