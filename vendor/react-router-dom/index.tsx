/* eslint-disable react-refresh/only-export-components */
import React, {
  AnchorHTMLAttributes,
  FC,
  MouseEvent,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type RouterLocation = {
  pathname: string;
  search: string;
  hash: string;
};

type NavigateOptions = {
  replace?: boolean;
};

type RouterContextValue = {
  location: RouterLocation;
  navigate: (to: string, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

const getCurrentLocation = (): RouterLocation => {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '' };
  }

  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    hash: window.location.hash || '',
  };
};

const normalizePath = (path: string): string => {
  if (!path) {
    return '/';
  }

  const startsWithSlash = path.startsWith('/');
  const sanitized = path.replace(/\/+$/, '');
  const value = sanitized === '' ? '/' : sanitized;
  return startsWithSlash ? value : `/${value}`;
};

const matchRoutePath = (path: string, pathname: string): boolean => {
  if (path === '*') {
    return true;
  }

  const normalizedPath = normalizePath(path);
  const normalizedLocation = normalizePath(pathname);

  return normalizedPath === normalizedLocation;
};

const matchNavPath = (to: string, pathname: string, end?: boolean): boolean => {
  const normalizedTo = normalizePath(to);
  const normalizedLocation = normalizePath(pathname);

  if (normalizedTo === '/') {
    return normalizedLocation === '/';
  }

  if (end) {
    return normalizedLocation === normalizedTo;
  }

  return (
    normalizedLocation === normalizedTo ||
    normalizedLocation.startsWith(`${normalizedTo}/`)
  );
};

const shouldHandleLinkClick = (event: MouseEvent<HTMLAnchorElement>, target?: string): boolean => {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    (!target || target === '_self') &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
};

const useRouterContext = (): RouterContextValue => {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error('Router components must be used within a BrowserRouter.');
  }

  return context;
};

export const BrowserRouter: FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<RouterLocation>(() => getCurrentLocation());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setLocation(getCurrentLocation());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    if (typeof window === 'undefined') {
      return;
    }

    const targetUrl = new URL(to, window.location.origin);
    const href = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;

    if (options?.replace) {
      window.history.replaceState(null, '', href);
    } else {
      window.history.pushState(null, '', href);
    }

    setLocation(getCurrentLocation());
  }, []);

  const contextValue = useMemo(
    () => ({ location, navigate }),
    [location, navigate]
  );

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
};

interface RoutesProps {
  children: ReactNode;
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

export const Route: FC<RouteProps> = () => null;

export const Routes: FC<RoutesProps> = ({ children }) => {
  const { location } = useRouterContext();
  let match: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (match !== null) {
      return;
    }

    if (!isValidElement<RouteProps>(child)) {
      return;
    }

    const { path, element } = child.props;

    if (matchRoutePath(path, location.pathname)) {
      match = element;
    }
  });

  return <>{match}</>;
};

type ClassNameResolver = (props: { isActive: boolean }) => string | undefined;

type NavLinkProps = {
  to: string;
  end?: boolean;
  className?: string | ClassNameResolver;
  style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties | undefined);
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'style' | 'href'>;

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    { to, end, className, style, onClick, children, target, ...rest },
    ref
  ) => {
    const { location, navigate } = useRouterContext();
    const isActive = matchNavPath(to, location.pathname, end);

    const resolvedClassName =
      typeof className === 'function'
        ? className({ isActive }) || undefined
        : className;

    const resolvedStyle =
      typeof style === 'function' ? style({ isActive }) : style;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(event);
      }

      if (!shouldHandleLinkClick(event, target)) {
        return;
      }

      event.preventDefault();
      navigate(to);
    };

    return (
      <a
        {...rest}
        ref={ref}
        href={to}
        target={target}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        className={resolvedClassName}
        style={resolvedStyle}
      >
        {children}
      </a>
    );
  }
);

NavLink.displayName = 'NavLink';

type LinkProps = {
  to: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, onClick, target, children, ...rest }, ref) => {
    const { navigate } = useRouterContext();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(event);
      }

      if (!shouldHandleLinkClick(event, target)) {
        return;
      }

      event.preventDefault();
      navigate(to);
    };

    return (
      <a
        {...rest}
        ref={ref}
        href={to}
        target={target}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export const useLocation = (): RouterLocation => useRouterContext().location;

export const useNavigate = (): ((to: string, options?: NavigateOptions) => void) =>
  useRouterContext().navigate;

export type { RouterLocation as Location, NavigateOptions };
