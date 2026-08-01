interface MarkdownArticleModule {
	frontmatter: {
		slug: string;
		title: string;
		description: string;
		category: string;
		date: string;
		datetime: string;
		author?: string;
		schemaType?: string;
		image?: string;
		imageAlt?: string;
		seo: {
			title: string;
			description: string;
			canonicalPath: string;
			ogTitle: string;
			ogDescription: string;
			ogImage: string;
			ogImageAlt: string;
			twitterCard: "summary" | "summary_large_image";
			robots: string;
		};
	};
	Content: unknown;
}

export interface ArticleCardData {
	title: string;
	excerpt: string;
	category: string;
	date: string;
	datetime: string;
	image?: string;
	href: string;
}

export interface ArticleData extends ArticleCardData {
	slug: string;
	categorySlug: string;
	description: string;
	author: string;
	schemaType?: string;
	imageAlt: string;
	seo: MarkdownArticleModule["frontmatter"]["seo"];
	Content: unknown;
}

const articleModules = import.meta.glob<MarkdownArticleModule>("../content/**/*.md", { eager: true });

function getArticlePathParts(path: string) {
	const match = path.match(/\/content\/([^/]+)\/([^/]+)\.md$/);

	if (!match) {
		throw new Error(`Invalid article path: ${path}`);
	}

	return {
		categorySlug: match[1],
		slug: match[2],
	};
}

export function getArticles(categorySlug?: string): ArticleData[] {
	return Object.entries(articleModules)
		.filter(([path]) => (categorySlug ? path.includes(`/content/${categorySlug}/`) : true))
		.map(([path, article]) => {
			const pathParts = getArticlePathParts(path);
			const slug = article.frontmatter.slug;

			if (!slug) {
				throw new Error(`Missing slug frontmatter in ${path}`);
			}

			return {
				slug,
				categorySlug: pathParts.categorySlug,
				title: article.frontmatter.title,
				excerpt: article.frontmatter.description,
				description: article.frontmatter.description,
				category: article.frontmatter.category,
				date: article.frontmatter.date,
				datetime: article.frontmatter.datetime,
				author: article.frontmatter.author ?? "Ajisaka Kamandnau",
				schemaType: article.frontmatter.schemaType,
				image: article.frontmatter.image,
				imageAlt: article.frontmatter.imageAlt ?? article.frontmatter.title,
				seo: article.frontmatter.seo,
				href: `/${slug}`,
				Content: article.Content,
			};
		})
		.sort((firstPost, secondPost) => new Date(secondPost.datetime).getTime() - new Date(firstPost.datetime).getTime());
}

export function getArticleCards(categorySlug?: string): ArticleCardData[] {
	return getArticles(categorySlug).map(({ title, excerpt, category, date, datetime, image, href }) => ({
		title,
		excerpt,
		category,
		date,
		datetime,
		image,
		href,
	}));
}
