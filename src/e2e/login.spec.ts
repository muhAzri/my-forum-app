import { test, expect } from '@playwright/test';

test.describe('Login Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should complete successful login flow with valid credentials', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            token: 'mock-jwt-token-12345',
          },
        }),
      });
    });

    await page.route('https://forum-api.dicoding.dev/v1/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              avatar: 'https://example.com/avatar.jpg',
            },
          },
        }),
      });
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Signing in...')).toBeVisible();

    await expect(page).toHaveURL('/');

    await expect(page.locator('body')).not.toContainText('Sign In');
  });

  test('should handle failed login with invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'fail',
          message: 'Invalid credentials',
        }),
      });
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/login failed/i)).toBeVisible();

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    await expect(page.getByLabel(/email/i)).toBeEnabled();
    await expect(page.getByLabel(/password/i)).toBeEnabled();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  test('should validate form fields and show appropriate error messages', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();

    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Email is invalid')).toBeVisible();

    await page.getByLabel(/email/i).fill('valid@example.com');

    await expect(page.getByText('Email is invalid')).not.toBeVisible();
  });

  test('should provide proper navigation and links', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/register');

    await signUpLink.click();
    await expect(page).toHaveURL('/register');

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');

    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.abort('failed');
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('should maintain form state during loading', async ({ page }) => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);

    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: { token: 'mock-token' },
        }),
      });
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText('Signing in...')).toBeVisible();

    await expect(page.getByLabel(/email/i)).toBeDisabled();
    await expect(page.getByLabel(/password/i)).toBeDisabled();
    await expect(page.getByRole('button')).toBeDisabled();

    await expect(page.getByLabel(/email/i)).toHaveValue(testEmail);
    await expect(page.getByLabel(/password/i)).toHaveValue(testPassword);
  });

  test('should handle redirect after successful login', async ({ page }) => {
    await page.goto('/create-thread');

    await expect(page).toHaveURL('/login');

    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: { token: 'mock-token' },
        }),
      });
    });

    await page.route('https://forum-api.dicoding.dev/v1/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
            },
          },
        }),
      });
    });

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/create-thread');
  });
});

test.describe('Login Page Accessibility and Responsive Design', () => {
  test('should be accessible and keyboard navigable', async ({ page }) => {
    await page.goto('/login');

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/password/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused();

    await page.getByLabel(/email/i).focus();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: { token: 'mock-token' },
        }),
      });
    });

    await page.keyboard.press('Enter');
    await expect(page.getByText('Signing in...')).toBeVisible();
  });

  test('should work correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    await page.getByLabel(/email/i).fill('mobile@test.com');
    await page.getByLabel(/password/i).fill('password123');

    await expect(page.getByLabel(/email/i)).toHaveValue('mobile@test.com');
    await expect(page.getByLabel(/password/i)).toHaveValue('password123');
  });
});
