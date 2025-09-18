import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { useNavigate } from './index.js';
import { BrowserRouter, Link, NavLink } from './index.js';
import { FC, ReactNode } from 'react';

type NavigationSpyWindow = Window & {
  __pushStateCalls: string[];
  __replaceStateCalls: string[];
  __assignCalls: string[];
  __replaceCalls: string[];
};

const createWindowMock = () => {
  const pushStateCalls: string[] = [];
  const replaceStateCalls: string[] = [];
  const assignCalls: string[] = [];
  const replaceCalls: string[] = [];

  const location = {
    origin: 'https://app.local',
    pathname: '/base/start',
    search: '',
    hash: '',
    assign: (url: string) => {
      assignCalls.push(url);
    },
    replace: (url: string) => {
      replaceCalls.push(url);
    },
  } as unknown as Location;

  const updateFromHref = (href: string) => {
    const resolved = new URL(href, location.origin);
    location.pathname = resolved.pathname;
    location.search = resolved.search;
    location.hash = resolved.hash;
  };

  const history = {
    pushState: (_state: unknown, _title: string, url?: string | URL | null) => {
      const href = typeof url === 'string' ? url : url?.toString() ?? '';
      pushStateCalls.push(href);
      if (href) {
        updateFromHref(href);
      }
    },
    replaceState: (_state: unknown, _title: string, url?: string | URL | null) => {
      const href = typeof url === 'string' ? url : url?.toString() ?? '';
      replaceStateCalls.push(href);
      if (href) {
        updateFromHref(href);
      }
    },
  } as unknown as History;

  const mockWindow = {
    location,
    history,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  } as unknown as NavigationSpyWindow;

  mockWindow.__pushStateCalls = pushStateCalls;
  mockWindow.__replaceStateCalls = replaceStateCalls;
  mockWindow.__assignCalls = assignCalls;
  mockWindow.__replaceCalls = replaceCalls;

  return mockWindow;
};

const setGlobalWindow = (mockWindow: NavigationSpyWindow) => {
  (globalThis as unknown as { window: NavigationSpyWindow }).window = mockWindow;
  (globalThis as unknown as { location: Location }).location = mockWindow.location;
  (globalThis as unknown as { history: History }).history = mockWindow.history;
};

const extractHref = (markup: string, label: string): string => {
  const pattern = new RegExp(`<a[^>]*href="([^"]*)"[^>]*>${label}</a>`);
  const match = markup.match(pattern);
  assert.ok(match, `Expected to find link for ${label} in ${markup}`);
  return match[1];
};

const captureNavigate = (children: ReactNode): {
  navigate: ReturnType<typeof useNavigate>;
  window: NavigationSpyWindow;
} => {
  const mockWindow = createWindowMock();
  setGlobalWindow(mockWindow);

  let navigateFn: ReturnType<typeof useNavigate> | undefined;

  const Capture: FC = () => {
    navigateFn = useNavigate();
    return <>{children}</>;
  };

  renderToStaticMarkup(
    <BrowserRouter basename="/base">
      <Capture />
    </BrowserRouter>
  );

  assert.ok(navigateFn, 'navigate should be defined');

  return { navigate: navigateFn!, window: mockWindow };
};

const withWindow = <T,>(action: () => T) => {
  const mockWindow = createWindowMock();
  setGlobalWindow(mockWindow);
  return { result: action(), window: mockWindow };
};

test('Link prepends the basename for internal targets', () => {
  const { result: markup } = withWindow(() =>
    renderToStaticMarkup(
      <BrowserRouter basename="/base">
        <Link to="/dashboard">Dashboard</Link>
      </BrowserRouter>
    )
  );

  assert.equal(extractHref(markup, 'Dashboard'), '/base/dashboard');
});

test('Link leaves absolute URLs unchanged', () => {
  const { result: markup } = withWindow(() =>
    renderToStaticMarkup(
      <BrowserRouter basename="/base">
        <Link to="https://external.example/app">External</Link>
      </BrowserRouter>
    )
  );

  assert.equal(
    extractHref(markup, 'External'),
    'https://external.example/app'
  );
});

test('NavLink prepends the basename for internal targets', () => {
  const { result: markup } = withWindow(() =>
    renderToStaticMarkup(
      <BrowserRouter basename="/base">
        <NavLink to="/reports">Reports</NavLink>
      </BrowserRouter>
    )
  );

  assert.equal(extractHref(markup, 'Reports'), '/base/reports');
});

test('NavLink keeps protocol links untouched', () => {
  const { result: markup } = withWindow(() =>
    renderToStaticMarkup(
      <BrowserRouter basename="/base">
        <NavLink to="mailto:team@example.com">Email</NavLink>
      </BrowserRouter>
    )
  );

  assert.equal(extractHref(markup, 'Email'), 'mailto:team@example.com');
});

test('navigate uses history for internal navigation', () => {
  const { navigate, window } = captureNavigate(null);

  navigate('/settings');

  assert.deepEqual(window.__pushStateCalls, ['/base/settings']);
  assert.deepEqual(window.__assignCalls, []);
  assert.deepEqual(window.__replaceCalls, []);
});

test('navigate delegates external URLs to window.location', () => {
  const { navigate, window } = captureNavigate(null);

  navigate('https://external.example/app');

  assert.deepEqual(window.__pushStateCalls, []);
  assert.deepEqual(window.__assignCalls, ['https://external.example/app']);
});
