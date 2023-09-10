import type { ComponentType, SvelteComponent } from 'svelte';

import { resolveLangText, type LangText, type Language } from '$shared/services/i18n';
import type { ProfileLinks } from '$shared/types';

export type PostTag = 'svelte' | 'kit' | 'ecosystem' | 'tooling' | 'community';

export type PostAuthor = {
  name: LangText;
  title?: LangText;
  links?: ProfileLinks;
  avatarUrl?: string;
};

export type Post = {
  slug: string;
  date: string;
  title: LangText;
  description: LangText;
  tags?: PostTag[];
  authors: PostAuthor[];
  ogImage?: string;
  keywords?: LangText[];
};

/** resolve any LangText to a string */
export function localizePost(language: Language, post: Post) {
  return {
    ...post,
    title: resolveLangText(language, post.title),
    description: resolveLangText(language, post.description),
    keywords: post.keywords?.map((tag) => resolveLangText(language, tag)),
    authors: post.authors.map((author) => ({
      ...author,
      name: resolveLangText(language, author.name),
      title: resolveLangText(language, author.title),
    })),
  };
}

type LangBlogContent = {
  vi: ComponentType<SvelteComponent>;
  en: ComponentType<SvelteComponent>;
};
export type BlogContent =
  | LangBlogContent
  | Pick<LangBlogContent, 'en'>
  | Pick<LangBlogContent, 'vi'>;

export function localizeBlogContent(language: Language, content: BlogContent) {
  if ('en' in content && 'vi' in content) {
    return content[language];
  } else if ('en' in content) {
    return content.en;
  } else {
    return content.vi;
  }
}

export function preparePageData(language: Language, post: Post, content: BlogContent) {
  const lPost = localizePost(language, post);
  return {
    supportedLanguages: Object.keys(content) as Language[],
    post: lPost,
    meta: {
      title: lPost.title,
      description: lPost.description,
      keywords: lPost.keywords,
      og: {
        type: 'article' as const,
        image: lPost.ogImage,
        imageAlt: lPost.title,
      },
      canonical: `https://sveltevietnam.dev/${language}/blog/${lPost.slug}`,
    },
  };
}
