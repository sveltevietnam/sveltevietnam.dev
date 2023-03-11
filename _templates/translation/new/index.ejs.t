---
to: src/lib/shared/services/i18n/translations/<%=domain%><%=name%>/index.ts
unless_exists: true
---
import { en } from './en';
import { vi } from './vi';

export const translations = { en, vi };
