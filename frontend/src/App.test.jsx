// @vitest-environment jsdom
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';
import { useTasks } from './hooks/useTasks';
vi.mock('./hooks/useTasks', () => ({ useTasks: vi.fn(() => ({ tasks: [], total: 30, loading: false, error: null })) }));
afterEach(cleanup);
test('search and status changes each reset pagination to page one', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Next'));
  expect(useTasks.mock.lastCall[2]).toBe(2);
  fireEvent.change(screen.getByPlaceholderText('Search tasks...'), { target: { value: 'api' } });
  expect(useTasks.mock.lastCall).toEqual(['api', '', 1, 10]);
  fireEvent.click(screen.getByText('Next'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'OPEN' } });
  expect(useTasks.mock.lastCall).toEqual(['api', 'OPEN', 1, 10]);
});
