---
to: <%=path%>/translation/index.ts
unless_exists: true
---
import { en } from './en';
import { vi } from './vi';

export const translations = { en, vi };
