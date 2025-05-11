<script>
  import { CalloutPlayground } from '$lib/components/callout-playground';
</script>

### Callout

Callout được sử dụng để tạo điểm nhấn cho một số nội dung đặc biệt trong bài viết.
Dưới đây là ví dụ một giao diện mà callout có thể hiển thị:

<div class="c-callout c-callout--success c-callout--icon-trophy">

Nội dung cần được nhấn mạnh...

</div>

Để hiển thị giao diện trên trong bài viết, bạn có thể sử dụng cú pháp sau:

```html title=".../vi.md.svelte"
<div class="c-callout c-callout--success c-callout--icon-trophy">

Nội dung cần được nhấn mạnh...

</div>
```

Bạn có thể dùng trình thử nghiệm sau để tìm lớp và giao diện phù hợp:

<CalloutPlayground />

