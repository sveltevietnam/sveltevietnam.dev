<script>
  import ExampleImage from './example/content/vi.md.svelte';
</script>

### Hình ảnh

Hiện tại, dự án chưa thể hỗ trợ cú pháp Markdown cho hình ảnh trong bài viết.
Thay vào đó, hãy sử dụng các thẻ HTML như ví dụ sau đây:

```svelte title="./content/vi.md.svelte" src="./example/content/vi.md.svelte"
```

Kết quả hiển thị:

<ExampleImage />

Lưu ý:
  - dự án khuyến khích bạn đặt hình ảnh trong thư mục `.../images`, tương tự như `thumbnail.jpg`
  được đề cập trong mục ["Cấu trúc mã nguồn bài viết"](#cau-truc-ma-nguon-bai-viet),
  - sử dụng import query `format=avif` để tối ưu hóa kích thước ảnh. Tham khảo thêm tại [imagetools - directives](https://github.com/JonasKruckenberg/imagetools/blob/973606522673ce865081bedc6d08d9deefa21699/docs/_media/directives.md),
  - thiết lập các thuộc tính `width`, `height` và `alt` phù hợp cho ảnh.

