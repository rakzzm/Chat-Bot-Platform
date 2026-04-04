/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { HelperSetting } from '@/helper/types';
import { SettingType } from '@/setting/schemas/types';

export const OPENROUTER_LLM_HELPER_NAME = 'openrouter-llm-helper';

export const OPENROUTER_LLM_HELPER_NAMESPACE = 'openrouter_llm_helper';

export default [
  {
    group: OPENROUTER_LLM_HELPER_NAMESPACE,
    label: 'api_key',
    value: process.env.OPENROUTER_API_KEY || '',
    type: SettingType.secret,
  },
  {
    group: OPENROUTER_LLM_HELPER_NAMESPACE,
    label: 'base_url',
    value: 'https://openrouter.ai/api/v1',
    type: SettingType.text,
  },
  {
    group: OPENROUTER_LLM_HELPER_NAMESPACE,
    label: 'default_model',
    value: 'qwen/qwen-2.5-72b-instruct',
    type: SettingType.text,
  },
] as const satisfies HelperSetting<typeof OPENROUTER_LLM_HELPER_NAME>[];
