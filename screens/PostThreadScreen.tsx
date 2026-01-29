import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

import {
  MOCK_POSTS,
  MOCK_COMMENTS,
  PostData,
  CommentData,
} from '../data/communitiesMockData';

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
        <View>
          <Text style={postCardStyles.authorName}>{post.authorName}</Text>
          <Text style={postCardStyles.timestamp}>{post.timestamp}</Text>
        </View>
        <TouchableOpacity onPress={onShare} style={postCardStyles.shareBtn}>
          <Ionicons name="share-outline" size={18} color={colors.light.primary} />
        </TouchableOpacity>
      </View>
      <Text style={postCardStyles.content}>{post.content}</Text>
      <View style={postCardStyles.footer}>
        <View style={postCardStyles.voteContainer}>
          <TouchableOpacity onPress={onUpvote} style={postCardStyles.voteButton}>
            <Ionicons name="arrow-up" size={16} color={colors.light.primary} />
          </TouchableOpacity>
          <Text style={postCardStyles.voteCount}>{post.upvotes - post.downvotes}</Text>
          <TouchableOpacity onPress={onDownvote} style={postCardStyles.voteButton}>
            <Ionicons name="arrow-down" size={16} color={colors.light.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: CommentData;
  onReply: () => void;
}) {
  const marginLeft = comment.depth * 12;
  return (
    <View style={[commentItemStyles.container, { marginLeft }]}>
      <View style={commentItemStyles.header}>
        <Text style={commentItemStyles.authorName}>{comment.authorName}</Text>
        <Text style={commentItemStyles.timestamp}>{comment.timestamp}</Text>
      </View>
      <Text style={commentItemStyles.content}>{comment.content}</Text>
      <View style={commentItemStyles.footer}>
        <View style={commentItemStyles.voteContainer}>
          <Ionicons name="arrow-up" size={12} color={colors.light.primary} />
          <Text style={commentItemStyles.voteCount}>
            {comment.upvotes - comment.downvotes}
          </Text>
        </View>
        <TouchableOpacity onPress={onReply} style={commentItemStyles.replyButton}>
          <Text style={commentItemStyles.replyText}>Ответить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
            <Ionicons name="close-circle" size={14} color={colors.light.primary} />
          </TouchableOpacity>
        </View>
      )}
      <View style={createCommentStyles.inputWrapper}>
        <TextInput
          style={createCommentStyles.input}
          placeholder="Написать комментарий..."
          placeholderTextColor={colors.light.mutedForeground}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[createCommentStyles.submitButton, !text.trim() && { opacity: 0.5 }]}
          onPress={() => {
            if (text.trim()) {
              onSubmit(text);
              setText('');
            }
          }}
          disabled={!text.trim()}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PostThreadScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { postId } = route.params || { postId: MOCK_POSTS[0].id };
  const post = MOCK_POSTS.find(p => p.id === postId) || MOCK_POSTS[0];
  const comments = MOCK_COMMENTS[post.id] || [];
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderComments = (list: CommentData[]) => {
    return list.map(comment => (
      <View key={comment.id}>
        <CommentItem
          comment={comment}
          onReply={() => setReplyingTo(comment.authorName)}
        />
        {comment.replies && comment.replies.length > 0 && (
          <View>{renderComments(comment.replies)}</View>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обсуждение</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <PostCard
            post={post}
            onUpvote={() => {}}
            onDownvote={() => {}}
            onShare={() => {}}
          />
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Комментарии ({post.commentCount})</Text>
            <View style={{ paddingHorizontal: spacing.lg }}>
              {comments.length > 0 ? (
                renderComments(comments)
              ) : (
                <Text style={styles.emptyText}>
                  Пока нет комментариев. Будьте первым!
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <CreateCommentInput
          onSubmit={() => setReplyingTo(undefined)}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(undefined)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  container: { flex: 1 },
  commentsSection: { marginTop: spacing.md },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.foreground,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.light.mutedForeground,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 13,
  },
});

const postCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  authorName: { fontWeight: '700', fontSize: 15 },
  timestamp: { color: colors.light.mutedForeground, fontSize: 11, marginTop: 1 },
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.foreground,
    marginBottom: spacing.md,
  },
  footer: { flexDirection: 'row', alignItems: 'center' },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 2,
  },
  voteButton: { padding: 6 },
  voteCount: { fontWeight: '700', marginHorizontal: 2, fontSize: 13 },
});

const commentItemStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    marginBottom: spacing.xs,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  authorName: { fontWeight: '700', fontSize: 13 },
  timestamp: { color: colors.light.mutedForeground, fontSize: 10 },
  content: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.light.foreground,
    marginBottom: 6,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteContainer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  voteCount: { fontSize: 12, fontWeight: '700', color: colors.light.primary },
  replyButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.light.secondary,
    borderRadius: 4,
  },
  replyText: { fontSize: 11, fontWeight: '600', color: colors.light.foreground },
});

const createCommentStyles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  replyingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  replyingText: { fontSize: 11, color: colors.light.primary, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: {
    flex: 1,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
