// PostThreadScreen.tsx
import React, { useState } from 'react'; // Добавляем импорт useState
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput, // Добавляем импорт TextInput
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

// --------------------
// Типы
// --------------------
interface PostData {
  id: string;
  authorName: string;
  timestamp: string;
  content: string;
  mediaUri?: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

interface CommentData {
  id: string;
  authorName: string;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  replies?: CommentData[];
}

interface PostThreadScreenProps {
  postId?: string;
  onBack?: () => void;
  onUpvotePost?: (postId: string) => void;
  onDownvotePost?: (postId: string) => void;
  onSharePost?: (postId: string) => void;
  onAuthorPress?: (authorName: string) => void;
  onSubmitComment?: (content: string, hasMedia: boolean, hasLink: boolean) => void;
}

// --------------------
// Компоненты (встроенные, если нет отдельного файла)
// --------------------

interface PostCardProps {
  post: PostData;
  onUpvote: () => void;
  onDownvote: () => void;
  onShare: () => void;
  onAuthorPress: () => void;
}

function PostCard({ post, onUpvote, onDownvote, onShare, onAuthorPress }: PostCardProps) {
  return (
    <View style={postCardStyles.container}>
      <View style={postCardStyles.header}>
        <TouchableOpacity onPress={onAuthorPress}>
          <Text style={postCardStyles.authorName}>{post.authorName}</Text>
        </TouchableOpacity>
        <Text style={postCardStyles.timestamp}>{post.timestamp}</Text>
      </View>

      <Text style={postCardStyles.content}>{post.content}</Text>

      <View style={postCardStyles.footer}>
        <View style={postCardStyles.voteContainer}>
          <TouchableOpacity onPress={onUpvote} style={postCardStyles.voteButton}>
            <Text style={postCardStyles.voteIcon}>↑</Text>
          </TouchableOpacity>
          <Text style={postCardStyles.voteCount}>{post.upvotes - post.downvotes}</Text>
          <TouchableOpacity onPress={onDownvote} style={postCardStyles.voteButton}>
            <Text style={postCardStyles.voteIcon}>↓</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onShare} style={postCardStyles.shareButton}>
          <Text style={postCardStyles.shareText}>Поделиться</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface CommentItemProps {
  comment: CommentData;
  onUpvote: () => void;
  onDownvote: () => void;
  onReply: () => void;
  onAuthorPress: () => void;
}

function CommentItem({
  comment,
  onUpvote,
  onDownvote,
  onReply,
  onAuthorPress,
}: CommentItemProps) {
  const marginLeft = comment.depth * 20;

  return (
    <View style={[commentItemStyles.container, { marginLeft }]}>
      <View style={commentItemStyles.header}>
        <TouchableOpacity onPress={onAuthorPress}>
          <Text style={commentItemStyles.authorName}>{comment.authorName}</Text>
        </TouchableOpacity>
        <Text style={commentItemStyles.timestamp}>{comment.timestamp}</Text>
      </View>

      <Text style={commentItemStyles.content}>{comment.content}</Text>

      <View style={commentItemStyles.footer}>
        <View style={commentItemStyles.voteContainer}>
          <TouchableOpacity onPress={onUpvote} style={commentItemStyles.voteButton}>
            <Text style={commentItemStyles.voteIcon}>↑</Text>
          </TouchableOpacity>
          <Text style={commentItemStyles.voteCount}>
            {comment.upvotes - comment.downvotes}
          </Text>
          <TouchableOpacity onPress={onDownvote} style={commentItemStyles.voteButton}>
            <Text style={commentItemStyles.voteIcon}>↓</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onReply} style={commentItemStyles.replyButton}>
          <Text style={commentItemStyles.replyText}>Ответить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface CommentThreadProps {
  comments: CommentData[];
  onUpvote: (commentId: string) => void;
  onDownvote: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onAuthorPress: (authorName: string) => void;
}

function CommentThread({
  comments,
  onUpvote,
  onDownvote,
  onReply,
  onAuthorPress,
}: CommentThreadProps) {
  function renderComments(commentsList: CommentData[]) {
    return commentsList.map(function (comment) {
      function handleUpvote() {
        onUpvote(comment.id);
      }

      function handleDownvote() {
        onDownvote(comment.id);
      }

      function handleReply() {
        onReply(comment.id);
      }

      function handleAuthorPress() {
        onAuthorPress(comment.authorName);
      }

      return (
        <View key={comment.id}>
          <CommentItem
            comment={comment}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onReply={handleReply}
            onAuthorPress={handleAuthorPress}
          />

          {comment.replies && comment.replies.length > 0 && (
            <View style={commentThreadStyles.repliesContainer}>
              {renderComments(comment.replies)}
            </View>
          )}
        </View>
      );
    });
  }

  return <View style={commentThreadStyles.container}>{renderComments(comments)}</View>;
}

interface CreateCommentInputProps {
  onSubmit: (content: string, hasMedia: boolean, hasLink: boolean) => void;
  replyingTo?: string;
  onCancelReply: () => void;
}

function CreateCommentInput({
  onSubmit,
  replyingTo,
  onCancelReply,
}: CreateCommentInputProps) {
  const [commentText, setCommentText] = useState('');

  function handleSubmit() {
    if (commentText.trim() !== '') {
      onSubmit(commentText, false, false);
      setCommentText('');
    }
  }

  return (
    <View style={createCommentStyles.container}>
      {replyingTo && (
        <View style={createCommentStyles.replyingContainer}>
          <Text style={createCommentStyles.replyingText}>Ответ на: {replyingTo}</Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Text style={createCommentStyles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={createCommentStyles.inputContainer}>
        <TextInput
          style={createCommentStyles.input}
          placeholder="Напишите комментарий..."
          placeholderTextColor={colors.light.mutedForeground}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />

        <TouchableOpacity style={createCommentStyles.submitButton} onPress={handleSubmit}>
          <Text style={createCommentStyles.submitText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --------------------
// Данные
// --------------------
const MOCK_POST: PostData = {
  id: '1',
  authorName: 'TechEnthusiast',
  timestamp: '4h ago',
  content:
    'Has anyone tried the new feature they released yesterday? I think it could be a game changer for how we interact with the platform. Would love to hear your thoughts and experiences!',
  mediaUri: 'placeholder-image',
  upvotes: 128,
  downvotes: 8,
  commentCount: 34,
};

const MOCK_COMMENTS: CommentData[] = [
  {
    id: 'c1',
    authorName: 'JohnDoe',
    timestamp: '3h ago',
    content:
      "Yes! I tried it this morning and it's incredible. The performance improvements alone make it worth the update.",
    upvotes: 45,
    downvotes: 2,
    depth: 0,
    replies: [
      {
        id: 'c1-1',
        authorName: 'TechEnthusiast',
        timestamp: '2h ago',
        content:
          "That's great to hear! Did you notice any issues with the new interface?",
        upvotes: 12,
        downvotes: 0,
        depth: 1,
        replies: [
          {
            id: 'c1-1-1',
            authorName: 'JohnDoe',
            timestamp: '1h ago',
            content:
              "Just a minor bug with the dark mode toggle, but nothing major. They'll probably fix it in the next patch.",
            upvotes: 8,
            downvotes: 0,
            depth: 2,
            replies: [
              {
                id: 'c1-1-1-1',
                authorName: 'BugHunter',
                timestamp: '45m ago',
                content: 'I reported that bug already. Should be fixed soon!',
                upvotes: 5,
                downvotes: 0,
                depth: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    authorName: 'SkepticalUser',
    timestamp: '2h ago',
    content:
      "I'm still on the fence about it. The learning curve seems steep for new users.",
    upvotes: 23,
    downvotes: 5,
    depth: 0,
    replies: [
      {
        id: 'c2-1',
        authorName: 'HelpfulHelper',
        timestamp: '1h ago',
        content:
          "There's actually a great tutorial in the docs that makes it much easier to understand. I can share the link if you want!",
        upvotes: 18,
        downvotes: 0,
        depth: 1,
      },
    ],
  },
  {
    id: 'c3',
    authorName: 'PowerUser',
    timestamp: '1h ago',
    content:
      'The keyboard shortcuts alone save me so much time. Highly recommend everyone check those out in the settings.',
    upvotes: 34,
    downvotes: 1,
    depth: 0,
  },
];

// --------------------
// Основной компонент
// --------------------
export default function PostThreadScreen(props: PostThreadScreenProps) {
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);

  // --------------------
  // Обработчики
  // --------------------
  function handleReply(commentId: string) {
    const comment = findCommentById(commentId, MOCK_COMMENTS);
    if (comment) {
      setReplyingTo(comment.authorName);
    }
  }

  function handleCancelReply() {
    setReplyingTo(undefined);
  }

  function handleSubmitComment(content: string, hasMedia: boolean, hasLink: boolean) {
    if (props.onSubmitComment) {
      props.onSubmitComment(content, hasMedia, hasLink);
    }
    setReplyingTo(undefined);
  }

  function handleBack() {
    if (props.onBack) {
      props.onBack();
    }
  }

  function handleUpvotePost() {
    if (props.onUpvotePost) {
      props.onUpvotePost(MOCK_POST.id);
    }
  }

  function handleDownvotePost() {
    if (props.onDownvotePost) {
      props.onDownvotePost(MOCK_POST.id);
    }
  }

  function handleSharePost() {
    if (props.onSharePost) {
      props.onSharePost(MOCK_POST.id);
    }
  }

  function handleAuthorPress(authorName: string) {
    if (props.onAuthorPress) {
      props.onAuthorPress(authorName);
    }
  }

  function handleCommentUpvote(commentId: string) {
    // Логика апвоута комментария
  }

  function handleCommentDownvote(commentId: string) {
    // Логика даунвоута комментария
  }

  // --------------------
  // Вспомогательная функция
  // --------------------
  function findCommentById(id: string, comments: CommentData[]): CommentData | undefined {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findCommentById(id, comment.replies);
        if (found) return found;
      }
    }
    return undefined;
  }

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обсуждение</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Контент */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Основной пост */}
        <PostCard
          post={MOCK_POST}
          onUpvote={handleUpvotePost}
          onDownvote={handleDownvotePost}
          onShare={handleSharePost}
          onAuthorPress={() => handleAuthorPress(MOCK_POST.authorName)}
        />

        {/* Секция комментариев */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Комментарии ({MOCK_POST.commentCount})</Text>

          <CommentThread
            comments={MOCK_COMMENTS}
            onUpvote={handleCommentUpvote}
            onDownvote={handleCommentDownvote}
            onReply={handleReply}
            onAuthorPress={handleAuthorPress}
          />
        </View>
      </ScrollView>

      {/* Поле ввода комментария */}
      <CreateCommentInput
        onSubmit={handleSubmitComment}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
    </SafeAreaView>
  );
}

// --------------------
// Стили основного компонента
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: colors.light.foreground,
    fontSize: 24,
  },
  headerTitle: {
    color: colors.light.foreground,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  commentsSection: {
    marginTop: spacing.md,
  },
  commentsTitle: {
    color: colors.light.foreground,
    fontSize: typography.base,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});

// --------------------
// Стили компонента PostCard
// --------------------
const postCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authorName: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  timestamp: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  content: {
    fontSize: typography.base,
    color: colors.light.foreground,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  voteButton: {
    padding: spacing.xs,
  },
  voteIcon: {
    fontSize: typography.lg,
    color: colors.light.mutedForeground,
  },
  voteCount: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
    minWidth: 30,
    textAlign: 'center',
  },
  shareButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.md,
  },
  shareText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
});

// --------------------
// Стили компонента CommentItem
// --------------------
const commentItemStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
  content: {
    fontSize: typography.sm,
    color: colors.light.foreground,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  voteButton: {
    padding: spacing.xs,
  },
  voteIcon: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
  },
  voteCount: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.foreground,
    minWidth: 24,
    textAlign: 'center',
  },
  replyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.md,
  },
  replyText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
});

// --------------------
// Стили компонента CommentThread
// --------------------
const commentThreadStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  repliesContainer: {
    marginTop: spacing.xs,
  },
});

// --------------------
// Стили компонента CreateCommentInput
// --------------------
const createCommentStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    padding: spacing.md,
  },
  replyingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  replyingText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    fontStyle: 'italic',
  },
  cancelText: {
    fontSize: typography.sm,
    color: colors.light.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    color: colors.light.foreground,
    minHeight: 40,
    maxHeight: 120,
  },
  submitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.primary,
    borderRadius: borderRadius.md,
  },
  submitText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
});
