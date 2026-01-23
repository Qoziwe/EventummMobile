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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

// --------------------
// Типы
// --------------------
interface PostData {
  id: string;
  authorName: string;
  timestamp: string;
  content: string;
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

// --------------------
// Компоненты UI (внутри файла)
// --------------------

// 1. Карточка поста
function PostCard({ post, onUpvote, onDownvote, onShare }: any) {
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
            <Ionicons name="arrow-up-outline" size={18} color={colors.light.mutedForeground} />
          </TouchableOpacity>
          <Text style={postCardStyles.voteCount}>{post.upvotes - post.downvotes}</Text>
          <TouchableOpacity onPress={onDownvote} style={postCardStyles.voteButton}>
            <Ionicons name="arrow-down-outline" size={18} color={colors.light.mutedForeground} />
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
function CommentItem({ comment, onReply }: any) {
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
           <Ionicons name="arrow-up-outline" size={16} color={colors.light.mutedForeground} />
           <Text style={commentItemStyles.voteCount}>{comment.upvotes - comment.downvotes}</Text>
           <Ionicons name="arrow-down-outline" size={16} color={colors.light.mutedForeground} />
        </View>
        <TouchableOpacity onPress={onReply} style={commentItemStyles.replyButton}>
          <Text style={commentItemStyles.replyText}>Ответить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. Дерево комментариев
function CommentThread({ comments, onReply }: any) {
  const renderComments = (list: CommentData[]) => {
    return list.map((comment) => (
      <View key={comment.id}>
        <CommentItem comment={comment} onReply={() => onReply(comment.id)} />
        {comment.replies && comment.replies.length > 0 && (
          <View style={{ marginTop: 4 }}>{renderComments(comment.replies)}</View>
        )}
      </View>
    ));
  };
  return <View style={{ paddingHorizontal: spacing.lg }}>{renderComments(comments)}</View>;
}

// 4. Ввод комментария
function CreateCommentInput({ onSubmit, replyingTo, onCancelReply }: any) {
  const [text, setText] = useState('');
  return (
    <View style={createCommentStyles.container}>
      {replyingTo && (
        <View style={createCommentStyles.replyingContainer}>
          <Text style={createCommentStyles.replyingText}>Ответ: {replyingTo}</Text>
          <TouchableOpacity onPress={onCancelReply}><Text style={createCommentStyles.cancelText}>X</Text></TouchableOpacity>
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
        <TouchableOpacity style={createCommentStyles.submitButton} onPress={() => { onSubmit(text); setText(''); }}>
          <Ionicons name="send" size={20} color={colors.light.primaryForeground} />
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
  content: 'Has anyone tried the new feature they released yesterday? I think it could be a game changer for how we interact with the platform.',
  upvotes: 128,
  downvotes: 8,
  commentCount: 34,
};

const MOCK_COMMENTS: CommentData[] = [
  {
    id: 'c1', authorName: 'JohnDoe', timestamp: '3h ago', content: "Yes! I tried it this morning and it's incredible.", upvotes: 45, downvotes: 2, depth: 0,
    replies: [
      { id: 'c1-1', authorName: 'TechEnthusiast', timestamp: '2h ago', content: "That's great to hear! Any bugs?", upvotes: 12, downvotes: 0, depth: 1 }
    ]
  },
  {
    id: 'c2', authorName: 'SkepticalUser', timestamp: '2h ago', content: "I'm still on the fence about it.", upvotes: 23, downvotes: 5, depth: 0
  }
];

// --------------------
// Экран
// --------------------
export default function PostThreadScreen() {
  const navigation = useNavigation();
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      {/* --- СТАНДАРТИЗИРОВАННЫЙ ХЕДЕР --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Обсуждение</Text>
        
        {/* Пустой блок справа для баланса */}
        <View style={styles.headerButtonRight} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PostCard post={MOCK_POST} onUpvote={()=>{}} onDownvote={()=>{}} onShare={()=>{}} />
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Комментарии ({MOCK_POST.commentCount})</Text>
          <CommentThread comments={MOCK_COMMENTS} onReply={(id: string) => setReplyingTo(id)} />
        </View>
      </ScrollView>

      <CreateCommentInput 
        onSubmit={(text: string) => setReplyingTo(undefined)} 
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
  
  // --- ЕДИНЫЕ СТИЛИ ХЕДЕРА ---
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
  headerButtonLeft: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerButtonRight: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  headerTitle: { flex: 1, fontSize: typography.xl, fontWeight: '700', color: colors.light.foreground, textAlign: 'center' },
  // ---------------------------

  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  commentsSection: { marginTop: spacing.md },
  commentsTitle: { color: colors.light.foreground, fontSize: typography.base, fontWeight: '600', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});

// Стили компонентов
const postCardStyles = StyleSheet.create({
  container: { backgroundColor: colors.light.card, marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: spacing.lg, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.light.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  authorName: { fontWeight: '600', fontSize: typography.base },
  timestamp: { color: colors.light.mutedForeground, fontSize: typography.sm },
  content: { fontSize: typography.base, lineHeight: 22, marginBottom: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.light.secondary, padding: 4, borderRadius: borderRadius.md },
  voteButton: { padding: 4 },
  voteCount: { fontWeight: '600', fontSize: typography.base },
  shareButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.light.secondary, borderRadius: borderRadius.md },
  shareText: { fontSize: typography.sm, fontWeight: '500' },
});

const commentItemStyles = StyleSheet.create({
  container: { backgroundColor: colors.light.card, marginBottom: spacing.sm, padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.light.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  authorName: { fontWeight: '600', fontSize: typography.sm },
  timestamp: { color: colors.light.mutedForeground, fontSize: typography.xs },
  content: { fontSize: typography.sm, lineHeight: 18, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voteCount: { fontSize: typography.sm, fontWeight: '600' },
  replyButton: { backgroundColor: colors.light.secondary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  replyText: { fontSize: typography.xs },
});

const createCommentStyles = StyleSheet.create({
  container: { backgroundColor: colors.light.card, borderTopWidth: 1, borderColor: colors.light.border, padding: spacing.md },
  replyingContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  replyingText: { fontSize: typography.sm, color: colors.light.mutedForeground, fontStyle: 'italic' },
  cancelText: { color: colors.light.primary },
  inputContainer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: colors.light.background, borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.lg, padding: spacing.md, minHeight: 40, maxHeight: 100 },
  submitButton: { backgroundColor: colors.light.primary, borderRadius: borderRadius.lg, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});