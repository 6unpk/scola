// 공통 타입 정의
export interface PageableResponse<T> {
  result: T[];
  limit: number;
  offset: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: string;
  isOAuth2User: boolean;
  avoidIngredients?: string[];
  healthInfo?: string[];
}

export interface Article {
  articleId: number;
  title: string;
  content: string;
  images: Image[];
  user: User;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
  likeCount: number;
  viewCount: number;
  comments: Comment[];
}

export interface Image {
  imageId: number;
  imageUrl: string;
}

export interface Topic {
  topicId: number;
  name: string;
}

export interface Comment {
  commentId: string; // UUID로 변경
  originalId?: string; // 원래 UUID 저장용
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  likeCount?: number;
  isLiked?: boolean;
}

// 실제 API 응답 타입 (이미 childComments 포함)
export interface ArticleCommentResponse {
  id: string;
  articleId: string;
  userId: string;
  userNickname: string;
  content: string;
  likeCount: number;
  childComments: ArticleCommentResponse[];
  isReply: boolean;
  createdAt: string;
  parentCommentId?: string;
}

// 좋아요 관련 타입
export interface ArticleLike {
  id: string;
  articleId: string;
  userId: string;
  userNickname: string;
  createdAt: string;
}

export interface CommentLike {
  id: string;
  commentId: string;
  userId: string;
  userNickname: string;
  createdAt: string;
}

export interface Foodit {
  id: string;
  title: string;
  content: string;
  images: Image[];
  user: User;
  authorProfileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  bookmarkCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// 카테고리 타입
export interface CommunityCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// 커뮤니티 게시글 타입
export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  title: string;
  content: string;
  imageUrls: string[];
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLikedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  content: string;
  likeCount: number;
  parentCommentId?: string;
  depth: number;
  replyCount: number;
  replies?: CommunityComment[];
  isLikedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodScan {
  scanId: number;
  imageUrl: string;
  result: any; // 스캔 결과 타입은 실제 API 응답에 따라 수정
  user: User;
  createdAt: string;
}

export interface Food {
  id: number;
  name: string;
  category: string;
  calories: number;
  nutrients: any; // 영양소 정보 타입은 실제 API 응답에 따라 수정
  productName?: string;
  businessName?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  notificationId: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number;
}

// 요청 타입 정의
export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
  name: string;
  avoidIngredients?: string[];
  healthInfo?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuth2TokenRequest {
  idToken: string;
  provider: "google";
  client: "android" | "ios" | "web";
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ArticleRequest {
  title: string;
  content: string;
  topicId?: number;
  images?: string[];
}

export interface FooditRequest {
  title: string;
  content: string;
  images?: string[];
}

export interface FooditBookmarkRequest {
  fooditId: number;
}

export interface CommunityPostRequest {
  title: string;
  content: string;
  imageUrls?: string[];
  categoryId?: string;
}

export interface CommunityPostLikeRequest {
  postId: string;
}

export interface CommentRequest {
  articleId: string;
  content: string;
  parentCommentId?: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommunityCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface CommunityCommentLikeRequest {
  commentId: string;
}

// Foodit API Types
export interface FooditCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  fooditCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FooditCategoryRequest {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Foodit {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  authorProfileImageUrl?: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  categoryId?: string;
  categoryName?: string;
  keywords?: string[];
  bookmarkCount: number;
  viewCount: number;
  shareCount: number;
  isFeatured: boolean;
  isBookmarkedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FooditRequest {
  title: string;
  content: string;
  thumbnailUrl?: string;
  categoryId?: string;
}

export interface FooditBookmarkRequest {
  fooditId: string;
}

export interface NoticeRequest {
  title: string;
  content: string;
}

export interface FoodSearchRequest {
  query: string;
  page?: number;
  size?: number;
}

export interface FoodScanRequest {
  image: string; // base64 encoded image
}

export interface FoodScanResult {
  id: string;
  productName: string;
  businessName: string;
  productType: string;
  rawMaterials: string;
  reportNumber: string;
  score: number;
}

export interface Ingredient {
  id: string;
  risk: "경고" | "주의" | "특정인 피해야 함" | "섭취제한권장" | "UNKNOWN";
  ingredientName: string;
  englishName?: string;
  ingredientType: string;
  relatedDisease: string | null;
  mentionedOrganizations: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FoodDetailResponse {
  id: string;
  productName: string;
  businessName: string;
  productType: string;
  rawMaterials: string;
  reportNumber: string;
  score: number;
  ingredients: Ingredient[];
}

export interface FoodScanResponse {
  id: string;
  userId: string;
  scanStatus: "SUCCESS" | "FAILURE";
  failureReason?: string;
  foodCode?: string | null;
  foodName?: string | null;
  scannedImageUrl: string;
  searchResults: FoodScanResult[] | null;
  scannedAt: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface NotificationMarkReadRequest {
  notificationIds: number[];
}
