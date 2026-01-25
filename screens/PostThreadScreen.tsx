import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

// Импортируем типы и данные из общего файла
import {
  MOCK_POSTS,
  MOCK_COMMENTS,
  PostData,
  CommentData,
} from '../data/communitiesMockData';

// --------------------
// Компоненты UI (внутри файла)
// --------------------

// 1. Карточка поста
function PostCard({
  post,
  onUpvote,
  onDownvote,
  onShare,
}: {
  post: PostData;
  onUpvote: () => void;
  onDownvote: () => void;
  onShare: () => void;
}) {
  return (
    <View style={postCardStyles.container}>
      <View style={postCardStyles.header}>
        <Text style={postCardStyles.authorName}>{post.authorName}</Text>
        <Text style={postCardStyles.timestamp}>{post.timestamp}</Text>
      </View>
      <Text style={postCardStyles.content}>{post.content}</Text>
      <View style={postCardStyles.footer}>
        <View style={postCardStyles.voteContainer}>
          <TouchableOpacity onPress={onUpvote} style={postCardStyles.voteButton}>
            <Ionicons
              name="arrow-up-outline"
              size={18}
              color={colors.light.mutedForeground}
            />
          </TouchableOpacity>
          <Text style={postCardStyles.voteCount}>{post.upvotes - post.downvotes}</Text>
          <TouchableOpacity onPress={onDownvote} style={postCardStyles.voteButton}>
            <Ionicons
              name="arrow-down-outline"
              size={18}
              color={colors.light.mutedForeground}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onShare} style={postCardStyles.shareButton}>
          <Text style={postCardStyles.shareText}>Поделиться</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 2. Элемент комментария
function CommentItem({
  comment,
  onReply,
}: {
  comment: CommentData;
  onReply: () => void;
}) {
  const marginLeft = comment.depth * 20;
  return (
    <View style={[commentItemStyles.container, { marginLeft }]}>
      <View style={commentItemStyles.header}>
        <Text style={commentItemStyles.authorName}>{comment.authorName}</Text>
        <Text style={commentItemStyles.timestamp}>{comment.timestamp}</Text>
      </View>
      <Text style={commentItemStyles.content}>{comment.content}</Text>
      <View style={commentItemStyles.footer}>
        <View style={commentItemStyles.voteContainer}>
          <Ionicons
            name="arrow-up-outline"
            size={16}
            color={colors.light.mutedForeground}
          />
          <Text style={commentItemStyles.voteCount}>
            {comment.upvotes - comment.downvotes}
          </Text>
          <Ionicons
            name="arrow-down-outline"
            size={16}
            color={colors.light.mutedForeground}
          />
        </View>
        <TouchableOpacity onPress={onReply} style={commentItemStyles.replyButton}>
          <Text style={commentItemStyles.replyText}>Ответить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. Дерево комментариев
function CommentThread({
  comments,
  onReply,
}: {
  comments: CommentData[];
  onReply: (id: string) => void;
}) {
  const renderComments = (list: CommentData[]) => {
    return list.map(comment => (
      <View key={comment.id}>
        <CommentItem comment={comment} onReply={() => onReply(comment.id)} />
        {comment.replies && comment.replies.length > 0 && (
          <View style={{ marginTop: 4 }}>{renderComments(comment.replies)}</View>
        )}
      </View>
    ));
  };
  return (
    <View style={{ paddingHorizontal: spacing.lg }}>{renderComments(comments)}</View>
  );
}

// 4. Ввод комментария
function CreateCommentInput({ onSubmit, replyingTo, onCancelReply }: any) {
  const [text, setText] = useState('');
  return (
    <View style={createCommentStyles.container}>
      {replyingTo && (
        <View style={createCommentStyles.replyingContainer}>
          <Text style={createCommentStyles.replyingText}>
            Ответ пользователю: {replyingTo}
          </Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Text style={createCommentStyles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={createCommentStyles.inputContainer}>
        <TextInput
          style={createCommentStyles.input}
          placeholder="Написать комментарий..."
          placeholderTextColor={colors.light.mutedForeground}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={createCommentStyles.submitButton}
          onPress={() => {
            if (text.trim()) {
              onSubmit(text);
              setText('');
            }
          }}
        >
          <Ionicons name="send" size={20} color={colors.light.primaryForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --------------------
// Экран
// --------------------
export default function PostThreadScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Получаем ID поста из навигации или берем первый доступный из моков
  const { postId } = route.params || { postId: MOCK_POSTS[0].id };

  const post = MOCK_POSTS.find(p => p.id === postId) || MOCK_POSTS[0];
  // В MOCK_COMMENTS данные лежат в объекте по ключам ID поста
  const comments = MOCK_COMMENTS[post.id] || [];

  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обсуждение</Text>
        <View style={styles.headerButtonRight} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PostCard
          post={post}
          onUpvote={() => {}}
          onDownvote={() => {}}
          onShare={() => {}}
        />
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Комментарии ({post.commentCount})</Text>
          {comments.length > 0 ? (
            <CommentThread
              comments={comments}
              onReply={(id: string) => setReplyingTo(id)}
            />
          ) : (
            <Text
              style={{
                paddingHorizontal: spacing.lg,
                color: colors.light.mutedForeground,
              }}
            >
              Пока нет комментариев. Будьте первым!
            </Text>
          )}
        </View>
      </ScrollView>

      <CreateCommentInput
        onSubmit={() => setReplyingTo(undefined)}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(undefined)}
      />
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
    minHeight: 56,
  },
  headerButtonLeft: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerButtonRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  commentsSection: { marginTop: spacing.md },
  commentsTitle: {
    color: colors.light.foreground,
    fontSize: typography.base,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});

const postCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  authorName: { fontWeight: '600', fontSize: typography.base },
  timestamp: { color: colors.light.mutedForeground, fontSize: typography.sm },
  content: { fontSize: typography.base, lineHeight: 22, marginBottom: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.secondary,
    padding: 4,
    borderRadius: borderRadius.md,
  },
  voteButton: { padding: 4 },
  voteCount: { fontWeight: '600', fontSize: typography.base },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.md,
  },
  shareText: { fontSize: typography.sm, fontWeight: '500' },
});

const commentItemStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  authorName: { fontWeight: '600', fontSize: typography.sm },
  timestamp: { color: colors.light.mutedForeground, fontSize: typography.xs },
  content: { fontSize: typography.sm, lineHeight: 18, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voteCount: { fontSize: typography.sm, fontWeight: '600' },
  replyButton: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  replyText: { fontSize: typography.xs },
});

const createCommentStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderTopWidth: 1,
    borderColor: colors.light.border,
    padding: spacing.md,
  },
  replyingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  replyingText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    fontStyle: 'italic',
  },
  cancelText: { color: colors.light.primary, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' },
  input: {
    flex: 1,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 40,
    maxHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.light.primary,
    borderRadius: borderRadius.lg,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
