import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { createThread } from '../../../core/store/slices/threadsSlice';
import { Button } from '../../../shared/components/ui/button';
import { ContentPolicy } from '../../../shared/components/ui/content-policy';
import { Input } from '../../../shared/components/ui/input';
import { TypingLoader } from '../../../shared/components/ui/pulse-loader';
import { RichTextEditor } from '../../../shared/components/ui/rich-text-editor';
import { stripHtml } from '../../../shared/utils/sanitize';
import { capitalizeCategory } from '../../../shared/utils/utils';

export function CreateThreadForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isCreating, categories } = useSelector((state: RootState) => state.threads);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors['title'] = 'Title is required';
    }

    const bodyText = stripHtml(formData.body).trim();
    if (!bodyText) {
      errors['body'] = 'Content is required';
    }

    if (!formData.category.trim()) {
      errors['category'] = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) { return; }

    const createResult = await dispatch(createThread({
      title: formData.title.trim(),
      body: formData.body,
      category: formData.category.trim(),
    }));

    if (createResult.meta.requestStatus === 'fulfilled' && createResult.payload) {
      navigate(`/threads/${(createResult.payload as { id: string }).id}`);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Thread
        </h1>

        <ContentPolicy />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            disabled={isCreating}
            error={formErrors['title']}
            label="Title"
            name="title"
            onChange={handleInputChange}
            placeholder="Enter thread title"
            required
            type="text"
            value={formData.title}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="category">
              Category
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isCreating}
              id="category"
              name="category"
              onChange={handleInputChange}
              required
              value={formData.category}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {capitalizeCategory(category)}
                </option>
              ))}
              <option value="General">General</option>
              <option value="Discussion">Discussion</option>
              <option value="Question">Question</option>
              <option value="News">News</option>
              <option value="Help">Help</option>
            </select>
            {formErrors['category'] && (
              <p className="text-sm text-red-600">{formErrors['category']}</p>
            )}
          </div>

          <RichTextEditor
            disabled={isCreating}
            error={formErrors['body']}
            label="Content"
            maxHeight={500}
            minHeight={200}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, body: value }));
              if (formErrors['body']) {
                setFormErrors((prev) => ({ ...prev, body: '' }));
              }
            }}
            placeholder="Write your thread content here... Use the toolbar for rich formatting."
            value={formData.body}
          />

          <div className="flex space-x-4">
            <Button
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? (
                <TypingLoader text="Creating thread" />
              ) : (
                'Create Thread'
              )}
            </Button>

            <Button
              disabled={isCreating}
              onClick={() => navigate(-1)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
