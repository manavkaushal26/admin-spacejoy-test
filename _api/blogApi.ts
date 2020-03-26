import { Role } from "@customTypes/userType";
import { page } from "@utils/config";

export const getBlogs = (role: Role): string => {
	if (role === Role.Author) {
		return `/v1/blogs/author`;
	}
	return `/v1/blogs/admin`;
};

export const blogApi = (blogId?: string): string => {
	if (blogId) return `/v1/blog/${blogId}`;
	return "/v1/blog";
};

export const getBlogCategories = (categoryId?: string): string => {
	if (categoryId) return `/v1/blogcategory/${categoryId}`;
	return "/v1/blogcategorys";
};

export const createBlogCategoryApi = (): string => {
	return "/v1/blogcategory";
};

export const uploadBlogImage = (blogId: string, type: "cover" | "body"): string => {
	const baseUrl = process.env.NODE_ENV !== "production" ? page.stageApiBaseUrl : page.apiBaseUrl;

	if (type === "cover") return `${baseUrl}/v1/blog/${blogId}/cover`;
	return `${baseUrl}/v1/blog/${blogId}/image`;
};

export const deleteUploadedBlogImage = (blogId: string, imageId: string): string => {
	return `/v1/blog/${blogId}/image?id=${imageId}`;
};

export const publishBlog = (blogId: string): string => {
	return `/v1/blog/${blogId}/publish`;
};

export const slugCheckApi = (slug: string): string => {
	return `/v1/blog/slug/check/${slug}`;
};
