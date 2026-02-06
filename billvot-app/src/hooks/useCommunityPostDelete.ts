import { useState } from "react";
import { communityService } from "@app/api/rest/services";

export function useCommunityPostDelete() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async (postId: string) => {
    setIsDeleting(true);
    try {
      await communityService.deletePost(postId);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePost,
    isDeleting,
  };
}
