export const vi = {
	title: 'Blog',
	typography: {
		title: 'Chữ viết',
		description:
			'\
			Kích cỡ và khoảng cách chữ viết cho bài viết tại Blog của Svelte Việt Nam được thiết lập dựa trên cấu hình mặc định của \
			<a class="c-link" href="https://tailwindcss.com/docs/typography-plugin" target="_blank" rel="noreferrer">@tailwincss/typography</a>, \
			bên trong phần tử mang lớp "prose". Một số màu sắc và phương thức hiển thị được tùy chỉnh để phù hợp với \
			thiết kế chung của <em>sveltevietnam.dev</em>. Bạn có thể xem cụ thể các tùy chỉnh đó tại \
			<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/tailwind.config.js" target="_blank" rel="noreferrer">tailwind.config.js</a>.\
			',
	},
	codeblock: {
		title: 'Hiển thị mã nguồn',
		description:
			'\
		Các bài viết mang tính kỹ thuật thường cần hiển thị các đoạn mã làm ví dụ. Svelte Việt Nam sử dụng thư viện \
		<a class="c-link" href="https://github.com/shikijs/shiki" target="_blank" rel="noreferrer">shiki</a> \
		để cung cấp màu sắc cho cú pháp (syntax highlighting). Cầu hình hiện tại sử dụng theme "Github Dark Dimmed". \
		Để hiển thị một đoạn code, hãy sử dụng cú pháp giống như trong markdown. \
		',
		language: 'Ngôn ngữ',
		sourceCode: 'Mã nguồn',
		example: 'Ví dụ, sử dụng ngôn ngữ svelte sẽ cho kết quả hiện thị đoạn mã như sau:',
		supportedLanguages:
			'\
		Hiện tại, các ngôn ngữ được hỗ trợ là: svelte, javascript, typescript, và shellscript. \
		Nếu có nhu cầu thêm ngôn ngữ khác, hãy tham khảo cấu hình "shiki" tại \
		<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/mdsvex.config.js#L24" target="_blank" rel="noreferrer">mdsvex.config.js</a>.\
		',
		diff: {
			description:
				'Để thể hiện thay đổi trong mã nguồn, bạn có thể gói các dòng mã cần thiết trong dòng chú thích với chỉ thị `:::diff +` hoặc `:::diff -`. Ví dụ, đoạn mã sau...',
			example: '...sẽ hiển thị',
		},
		highlight: {
			description:
				'Tương tự, để làm nổi bật một đoạn mã, bạn có thể gói các dòng mã cần thiết trong dòng chú thích với chỉ thị `:::highlight`. Ví dụ, đoạn mã sau...',
			example: '...sẽ hiển thị',
		},
	},
	components: {
		title: 'Thành phần thường gặp',
		description:
			'\
		Trong quá trình viết bài sẽ xuất hiện các kết cấu và hình mẫu được sử dụng nhiều lần. \
		Đây là cơ hội để tổng hợp thành những thành phần chung giúp người viết có thể dễ dàng tái sử dụng cho những bài viết sau. \
		',
		callout: {
			title: 'Chú thích',
			description:
				'\
			Đây là chi tiết đươc đặt trong một ô màu, mang ngữ nghĩa bổ sung cho văn bản hiện tại, \
			thường dùng khi bạn muốn người đọc nhanh chóng nhận biết và chú ý vào một hướng dẫn, lời nhắn nào đó. \
			Để sử dụng, bạn cần thêm vào phần tử HTML một lớp `c-callout` và một trong nhưng biến thể sau đây: \
			`c-callout--info`, `c-callout--success`, `c-callout--warning`, `c-callout-error`.\
			',
			icon: 'Ngoài ra, ta còn có thể kết hợp một số biến thể đặc biệt giúp thay đổi biểu tượng ở góc trái, trên.',
			examples: {
				info: 'Dùng `c-callout-info` để thể hiện một hướng dẫn, thông báo chung',
				success:
					'Dùng `c-callout-success` để thể hiện một chi tiết mang tính hoàn thiện, thành công, khuyến khích',
				warning: 'Dùng `c-callout-warning` để thể hiện một cảnh báo',
				error: 'Dùng `c-callout-error` để thể hiện một thông báo lỗi hoặc một tình huống xấu',
				bulb: 'Kết hợp với `c-callout--icon-bulb` để thể hiện ý tưởng hoặc sự sáng tạo',
				confetti:
					'Kết hợp với `c-callout--icon-confetti` để thể hiện một điều mới mẻ hoặc sự vui mừng',
				trophy: 'Kết hợp vói `c-callout--icon-trophy` để thể hiện sự tuyên dương, tán thưởng',
			},
			container:
				'\
			Trong khi viết bài bằng cú pháp markdown mở rộng của Svelte Việt Nam (mdsvex), \
			bạn có thể gói một phân đoạn trong ô chú thích bằng cú pháp ":::" từ thư viện \
			<a class="c-link" href="https://github.com/Nevenall/remark-containers" target="_blank" rel="noreferrer">remark-container</a>.\
			',
		},
	},
};
