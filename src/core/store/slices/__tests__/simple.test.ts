describe('Simple Test Suite', () => {
  test('should pass basic arithmetic test', () => {
    expect(2 + 2).toBe(4);
  });

  test('should pass string test', () => {
    expect('hello world').toContain('world');
  });

  test('should handle arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
  });

  test('should handle objects', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John Doe');
  });
});
