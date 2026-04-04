/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { AnyMessage } from '@/chat/schemas/types/message';
import { HelperService } from '@/helper/helper.service';
import BaseLlmHelper from '@/helper/lib/base-llm-helper';
import { LLM } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { SettingService } from '@/setting/services/setting.service';

import { OPENROUTER_LLM_HELPER_NAME } from './settings';

@Injectable()
export default class OpenRouterLlmHelper extends BaseLlmHelper<
  typeof OPENROUTER_LLM_HELPER_NAME
> {
  constructor(
    settingService: SettingService,
    helperService: HelperService,
    logger: LoggerService,
    private readonly httpService: HttpService,
  ) {
    super(OPENROUTER_LLM_HELPER_NAME, settingService, helperService, logger);
  }

  getPath() {
    return __dirname;
  }

  private async getClient() {
    const settings = await this.getSettings();
    return {
      apiKey: settings.api_key,
      baseUrl: settings.base_url,
      defaultModel: settings.default_model,
    };
  }

  async generateResponse(
    prompt: string,
    model: string,
    systemPrompt: string,
    extra?: any,
  ): Promise<string> {
    const { apiKey, baseUrl, defaultModel } = await this.getClient();
    const targetModel = model || defaultModel;

    const response = await firstValueFrom(
      this.httpService.post(
        `${baseUrl}/chat/completions`,
        {
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          ...extra,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hexabot.ai',
            'X-Title': 'Hexabot Chat Bot Platform',
          },
        },
      ),
    );

    return response.data.choices[0].message.content;
  }

  async generateStructuredResponse<T>(
    prompt: string,
    model: string,
    systemPrompt: string,
    schema: LLM.ResponseSchema,
    extra?: any,
  ): Promise<T> {
    const { apiKey, baseUrl, defaultModel } = await this.getClient();
    const targetModel = model || defaultModel;

    const response = await firstValueFrom(
      this.httpService.post(
        `${baseUrl}/chat/completions`,
        {
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          ...extra,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hexabot.ai',
            'X-Title': 'Hexabot Chat Bot Platform',
          },
        },
      ),
    );

    const content = response.data.choices[0].message.content;
    try {
      return JSON.parse(content) as T;
    } catch (e) {
      this.logger.error('Failed to parse structured response from LLM', e);
      return content as unknown as T;
    }
  }

  async generateChatCompletion(
    prompt: string,
    model: string,
    systemPrompt?: string,
    history: AnyMessage[] = [],
    extra?: any,
  ): Promise<string> {
    const { apiKey, baseUrl, defaultModel } = await this.getClient();
    const targetModel = model || defaultModel;

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // Map Hexabot messages to OpenAI format
    for (const msg of history) {
      // Simplification: handle only text messages for now
      if (msg.message && typeof msg.message === 'object' && 'text' in msg.message) {
         messages.push({
           role: msg.recipient ? 'assistant' : 'user',
           content: msg.message.text
         });
      }
    }

    messages.push({ role: 'user', content: prompt });

    const response = await firstValueFrom(
      this.httpService.post(
        `${baseUrl}/chat/completions`,
        {
          model: targetModel,
          messages,
          ...extra,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hexabot.ai',
            'X-Title': 'Hexabot Chat Bot Platform',
          },
        },
      ),
    );

    return response.data.choices[0].message.content;
  }
}
