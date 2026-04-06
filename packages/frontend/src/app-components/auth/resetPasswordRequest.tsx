/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Button, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useRequestResetPassword } from "@/hooks/entities/reset-hooks";
import { useToast } from "@/hooks/useToast";
import { useTranslate } from "@/hooks/useTranslate";

import { PublicContentWrapper } from "../../components/anonymous/PublicContentWrapper";
import { ContentContainer } from "../dialogs";
import { Input } from "../inputs/Input";

export const ResetPasswordRequest = () => {
  const { t } = useTranslate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });
  const { mutate: requestReset } = useRequestResetPassword({
    onSuccess: () => {
      toast.success(t("message.reset_success"));
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
          id="resetPasswordForm"
          onSubmit={handleSubmit((payload) => {
            requestReset(payload);
          })}
        >
          <ContentContainer gap={3}>
            <Typography variant="h1" fontSize="28px" fontWeight={700} textAlign="center" sx={{ mb: 0.5 }}>
              {t("title.reset_password")}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Enter your email to receive a reset link
            </Typography>
            <Input
              label={t("label.email")}
              error={!!errors.email}
              required
              autoFocus
              {...register("email", {
                required: t("message.email_is_required"),
              })}
              helperText={errors.email ? errors.email.message : null}
            />
            <Grid container gap={2} justifyContent="flex-end">
              <Button
                variant="contained"
                form="resetPasswordForm"
                type="submit"
                sx={{ px: 4 }}
              >
                {t("button.submit")}
              </Button>
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
