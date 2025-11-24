<script>
  import { LoadingContext } from '@sveltevietnam/kit/contexts';
  import Example1 from './examples/1-sveltekit-navgiating-state.md.svelte';
  import Example2 from './examples/2-context-abstraction.md.svelte';
  import Example3 from './examples/3-using-context.md.svelte';
  import Example4 from './examples/4-manual-trigger.md.svelte';
  import Example5 from './examples/5-manual-load.md.svelte';
  import Example6 from './examples/6-pattern-global-context.md.svelte';
  import Example7 from './examples/7-pattern-passing-state.md.svelte';

	const globalLoading = LoadingContext.getGlobal();

  let unload = null;
  function toggleLoadingBar() {
    if (unload) {
      unload();
      unload = null;
    } else {
      unload = globalLoading.load();
    }
  }
</script>

Chỉ thị tiến trình (tạm dịch từ [Progress indicators](https://www.nngroup.com/articles/progress-indicators/)),
thường được gọi là spinner hoặc loader, đôi khi bị lạm dụng trong giao diện, dẫn đến trải nghiệm không tốt.
Tuy nhiên nếu được sử dụng với mục đích rõ ràng, chỉ thị này có thể giúp phản hồi kịp thời về trạng thái
hệ thống (xem thêm [visibility of system status](https://www.nngroup.com/articles/visibility-system-status/))
và tạo cảm giác dễ chịu hơn cho người dùng khi một tác vụ nào đó đang bị trì hoãn.

Theo mình,
