import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const RouterContext = createContext(null);

const normalizePath = (path) => {
  if (typeof path !== 'string' || path.length === 0) {
    return '/';
  }
  let normalized = path;
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
};

const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('Router context is not available. Make sure your app is wrapped with <BrowserRouter>.');
  }
  return context;
};

export function BrowserRouter({ children }) {
  const initialPath = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';
  const [location, setLocation] = useState(initialPath);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => {
      setLocation(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to, options = {}) => {
    const target = normalizePath(to);
    if (typeof window !== 'undefined') {
      if (options.replace) {
        window.history.replaceState(options.state ?? null, '', target);
      } else {
        window.history.pushState(options.state ?? null, '', target);
      }
    }
    setLocation(target);
  }, []);

  const value = useMemo(() => ({
    location,
    navigate
  }), [location, navigate]);

  return React.createElement(RouterContext.Provider, { value }, children);
}

const matchPath = (routePath, currentPath) => {
  const normalizedRoute = normalizePath(routePath);
  if (normalizedRoute === currentPath) {
    return true;
  }
  if (normalizedRoute.endsWith('/*')) {
    const base = normalizedRoute.slice(0, -2);
    return currentPath.startsWith(base);
  }
  return false;
};

export function Routes({ children }) {
  const { location } = useRouterContext();
  let matchedElement = null;

  React.Children.forEach(children, (child) => {
    if (matchedElement || !React.isValidElement(child)) {
      return;
    }
    const { path, element, index } = child.props || {};
    if (index && location === '/') {
      matchedElement = element ?? null;
      return;
    }
    if (typeof path === 'string' && matchPath(path, location)) {
      matchedElement = element ?? null;
    }
  });

  return matchedElement;
}

export function Route() {
  return null;
}

export function useNavigate() {
  const { navigate } = useRouterContext();
  return navigate;
}

export function useLocation() {
  const { location } = useRouterContext();
  return useMemo(() => ({ pathname: location }), [location]);
}

export function NavLink({ to, className, children, replace = false, ...rest }) {
  const { location, navigate } = useRouterContext();
  const normalizedTo = normalizePath(to);
  const isActive = location === normalizedTo;
  const resolvedClassName = typeof className === 'function'
    ? className({ isActive })
    : className;

  const { onClick, target, ...anchorProps } = rest;

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      target === '_blank' ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(normalizedTo, { replace });
  };

  const renderedChildren = typeof children === 'function'
    ? children({ isActive })
    : children;

  return React.createElement(
    'a',
    {
      ...anchorProps,
      href: normalizedTo,
      target,
      onClick: handleClick,
      className: resolvedClassName,
      'aria-current': isActive ? 'page' : undefined
    },
    renderedChildren
  );
}

export function Link(props) {
  return NavLink({ ...props, className: props.className });
}

export default {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
  Link
};
