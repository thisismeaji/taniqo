export type PostSchemaType =
	| "HowTo"
	| "Article"
	| "OpinionNewsArticle"
	| "BlogPosting"
	| "NewsArticle";

interface BuildPostSchemaParams {
	schemaType?: PostSchemaType;
	title: string;
	description: string;
	category: string;
	datePublished: string;
	author: string;
	authorUrl?: string;
	image: string;
	url: string;
	siteName?: string;
}

const supportedSchemaTypes = new Set<PostSchemaType>([
	"HowTo",
	"Article",
	"OpinionNewsArticle",
	"BlogPosting",
	"NewsArticle",
]);

export function normalizePostSchemaType(schemaType?: string, category?: string): PostSchemaType {
	if (schemaType && supportedSchemaTypes.has(schemaType as PostSchemaType)) {
		return schemaType as PostSchemaType;
	}

	if (category?.toLowerCase() === "berita") {
		return "NewsArticle";
	}

	return "BlogPosting";
}

export function buildPostSchema({
	schemaType,
	title,
	description,
	category,
	datePublished,
	author,
	authorUrl = "https://www.instagram.com",
	image,
	url,
	siteName = "Taniqo",
}: BuildPostSchemaParams) {
	const type = normalizePostSchemaType(schemaType);
	const normalizeDate = (value: string) => {
		const trimmed = value?.trim();
		if (!trimmed) return new Date().toISOString();

		const parsed = new Date(trimmed);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}

		return new Date().toISOString();
	};
	const baseSchema = {
		"@context": "https://schema.org",
		"@type": type,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		headline: title,
		description,
		image: [image],
		datePublished: normalizeDate(datePublished),
		dateModified: normalizeDate(datePublished),
		articleSection: category,
		author: {
			"@type": "Person",
			name: author,
			url: authorUrl,
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
		},
	};

	if (type === "HowTo") {
		return {
			...baseSchema,
			name: title,
			step: [
				{
					"@type": "HowToStep",
					name: "Pahami kebutuhan tanaman",
					text: "Kenali jenis tanaman dan kebutuhan media tanamnya sebelum menentukan campuran tanah.",
				},
				{
					"@type": "HowToStep",
					name: "Siapkan media tanam",
					text: "Campurkan tanah gembur, kompos matang, dan sekam bakar dengan komposisi yang sesuai.",
				},
				{
					"@type": "HowToStep",
					name: "Evaluasi drainase",
					text: "Siram media dan pastikan air keluar dengan baik tanpa menggenang terlalu lama.",
				},
			],
		};
	}

	return baseSchema;
}
