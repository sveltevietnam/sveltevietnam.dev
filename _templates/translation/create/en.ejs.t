---
to: src/lib/shared/services/i18n/translations/<%=domain%><%=name%>/en.ts
unless_exists: true
---
import type { vi } from './vi';

export const en = {} satisfies typeof vi;
