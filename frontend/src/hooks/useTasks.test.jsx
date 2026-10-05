// @vitest-environment jsdom
import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useTasks } from './useTasks';
import { fetchTasks } from '../api';
vi.mock('../api', () => ({ fetchTasks: vi.fn() }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });

test('a late response cannot replace the current search or finish its loading state', async () => {
  let oldResolve, newResolve;
  fetchTasks.mockImplementationOnce(() => new Promise(r => { oldResolve = r; }))
    .mockImplementationOnce(() => new Promise(r => { newResolve = r; }));
  const { result, rerender } = renderHook(({ q }) => useTasks(q, '', 1, 10), { initialProps: { q: 'old' } });
  const signal = fetchTasks.mock.calls[0][1];
  rerender({ q: 'new' });
  expect(signal.aborted).toBe(true);
  await act(async () => oldResolve({ items: [{ id: 1 }], total: 1 }));
  expect(result.current.loading).toBe(true);
  expect(result.current.tasks).toEqual([]);
  await act(async () => newResolve({ items: [{ id: 2 }], total: 1 }));
  expect(result.current.tasks).toEqual([{ id: 2 }]);
  expect(result.current.loading).toBe(false);
});

test('failure stops loading and the next successful request clears the error', async () => {
  fetchTasks.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ items: [{ id: 3 }], total: 1 });
  const { result, rerender } = renderHook(({ q }) => useTasks(q, '', 1, 10), { initialProps: { q: 'first' } });
  await waitFor(() => expect(result.current.error).toBe('offline'));
  expect(result.current.loading).toBe(false);
  rerender({ q: 'second' });
  await waitFor(() => expect(result.current.tasks).toEqual([{ id: 3 }]));
  expect(result.current.error).toBe(null);
});
