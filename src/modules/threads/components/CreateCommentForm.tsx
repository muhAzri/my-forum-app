import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../../core/store';
import { createComment } from '../../../core/store/slices/threadsSlice';
import Button from '../../../shared/components/atoms/Button';
import Spinner from '../../../shared/components/atoms/Spinner';
import { RichTextEditor } from '../../../shared/components/ui/rich-text-editor';
import { stripHtml } from '../../../shared/utils/sanitize';

interface CreateCommentFormProps {
  threadId: string;
}

export function CreateCommentForm({ threadId }: CreateCommentFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating } = useSelector((state: RootState) => state.threads);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const textContent = stripHtml(content).trim();
    if (!textContent) {
      setError('Comment content is required');
      return;
    }

    try {
      await dispatch(createComment({ threadId, content })).unwrap();
      setContent('');
      setError('');
    } catch {
      setError('Failed to create comment');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <RichTextEditor
        disabled={isCreating}
        error={error}
        label="Add a comment"
        maxHeight={300}
        minHeight={120}
        onChange={(value) => {
          setContent(value);
          if (error) { setError(''); }
        }}
        placeholder="Write your comment here... Use the toolbar for formatting."
        showTips={false}
        value={content}
      />

      <Button disabled={isCreating || !stripHtml(content).trim()} type="submit">
        {isCreating ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Posting comment...</span>
          </div>
        ) : (
          'Post Comment'
        )}
      </Button>
    </form>
  );
}