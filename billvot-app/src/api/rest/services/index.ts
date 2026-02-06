// ⚠️ DEPRECATED: 이 파일은 기존 프로젝트 호환성을 위한 placeholder입니다.
// 새로운 API는 @app/api/services를 사용하세요.

import { restClient } from "../client";
export { restClient };

// Placeholder types
export type Notification = { id: string; type: string; message: string; isRead: boolean; createdAt: string; referenceId?: string };
export type Notice = { id: string; title: string; content: string; createdAt: string };
export type SearchResultItem = { id: string; type: string; title: string; content: string; categoryName: string; thumbnailUrl?: string; authorName: string; authorProfileImageUrl?: string; viewCount: number; likeCount?: number; bookmarkCount?: number };
export type AuthResponse = { accessToken: string; refreshToken: string; member: { id: number; email: string; name: string } };
export type Article = { id: string; title: string; content: string; thumbnailUrl?: string; authorName: string; createdAt: string; viewCount: number; likeCount: number; commentCount: number };
export type PopularArticle = Article;
export type Ingredient = { id: string; name: string; description: string };
export type UpdateUserRequest = { name?: string; profileImage?: string };
export type DeclarationCategory = "spam" | "abuse" | "inappropriate" | "other";
export type DeclarationRequest = { targetId: string; targetType: string; category: DeclarationCategory; reason?: string };
export type PresignedUrlRequest = { fileName: string; contentType: string };
export type NotificationSummary = { unreadCount: number };

// Placeholder services (비활성화된 기능들)
const notImplemented = () => { throw new Error("This feature is not implemented in billvot"); };

export const noticeService = { getNoticesWithPagination: notImplemented, getNoticeById: notImplemented };
export const searchService = { search: notImplemented };
export const authService = { login: notImplemented, oauth2Login: notImplemented, getMe: notImplemented, signUp: notImplemented, checkEmail: notImplemented, checkNickname: notImplemented, sendVerificationCode: notImplemented, verifyCode: notImplemented, resetPassword: notImplemented, updatePassword: notImplemented, updateProfile: notImplemented };
export const articleService = { getArticles: notImplemented, getArticle: notImplemented, createArticle: notImplemented, updateArticle: notImplemented, deleteArticle: notImplemented, likeArticle: notImplemented, unlikeArticle: notImplemented, getBreakingNews: notImplemented, searchArticles: notImplemented, getLikedArticles: notImplemented };
export const popularArticleService = { getPopularArticles: notImplemented };
export const communityService = { getPosts: notImplemented, getPost: notImplemented, createPost: notImplemented, updatePost: notImplemented, deletePost: notImplemented, likePost: notImplemented, unlikePost: notImplemented, getComments: notImplemented, createComment: notImplemented, deleteComment: notImplemented, getMyPosts: notImplemented };
export const ingredientService = { getIngredients: notImplemented, getIngredient: notImplemented, searchIngredients: notImplemented };
export const fooditService = { getFoodits: notImplemented, getFoodit: notImplemented, likeFoodit: notImplemented, unlikeFoodit: notImplemented, getLikedFoodits: notImplemented, getEditors: notImplemented, getEditorArticles: notImplemented };
export const commentService = { getComments: notImplemented, createComment: notImplemented, deleteComment: notImplemented, likeComment: notImplemented, getLikedComments: notImplemented };
export const declarationService = { report: notImplemented };
export const s3Service = { getPresignedUrl: notImplemented, uploadFile: notImplemented };
export const notificationService = { getNotifications: notImplemented, getSummary: notImplemented, markAsRead: notImplemented, markAllAsRead: notImplemented };
