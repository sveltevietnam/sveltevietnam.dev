import { LANGUAGES } from '@internals/utils/language';
import { enum as zEnum } from 'zod';

export const LanguageSchema = zEnum(LANGUAGES);
