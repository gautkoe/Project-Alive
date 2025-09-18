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
  createHref: (to: string) => string;
};

const RouterContext = createContext<RouterContextValue | null>(null);

const normalizePath = (path: string): string => {
  if (!path) {
    return '/';
  }

  const startsWithSlash = path.startsWith('/');
  const sanitized = path.replace(/\/+$/, '');
  const value = sanitized === '' ? '/' : sanitized;
  return startsWithSlash ? value : `/${value}`;
};

const normalizeBasename = (basename?: string): string => {
  if (!basename) {
    return '/';
  }

  try {
    return normalizePath(new URL(basename).pathname || '/');
  } catch {
    try {
      return normalizePath(new URL(basename, 'http://localhost').pathname || '/');
    } catch {
      return normalizePath(basename);
    }
  }
};

const stripBasename = (pathname: string, basename: string): string => {
  const targetPathname = pathname || '/';

  if (!basename || basename === '/' || basename === '') {
    return targetPathname;
  }

  if (!targetPathname.startsWith(basename)) {
    return targetPathname;
  }

  const nextChar = targetPathname.charAt(basename.length);

  if (nextChar && nextChar !== '/') {
    return targetPathname;
  }

  const stripped = targetPathname.slice(basename.length);

  if (!stripped) {
    return '/';
  }

  return stripped.startsWith('/') ? stripped : `/${stripped}`;
};

const applyBasename = (pathname: string, basename: string): string => {
  const normalizedPathname = normalizePath(pathname);

  if (!basename || basename === '/' || basename === '') {
    return normalizedPathname;
  }

  if (normalizedPathname === '/') {
    return `${basename}/`;
  }

  return `${basename}${normalizedPathname}`;
};

const resolveToUrl = (to: string): URL => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(to, window.location.origin);
  }

  return new URL(to, 'http://localhost');
};

const createHrefWithBasename = (to: string, basename: string): string => {
  const targetUrl = resolveToUrl(to);
  const pathname = applyBasename(targetUrl.pathname, basename);
  return `${pathname}${targetUrl.search}${targetUrl.hash}`;
};

const getDefaultBasename = (): string | undefined => {
  const envBasename = (
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL
  );

  if (envBasename) {
    return envBasename;
  }

  if (typeof document !== 'undefined') {
    return document.baseURI;
  }

  return undefined;
};

const getCurrentLocation = (basename: string): RouterLocation => {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '' };
  }

  const relativePathname = stripBasename(window.location.pathname || '/', basename);

  return {
    pathname: relativePathname === '' ? '/' : relativePathname,
    search: window.location.search || '',
    hash: window.location.hash || '',
  };
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

type BrowserRouterProps = {
  children: ReactNode;
  basename?: string;
};

export const BrowserRouter: FC<BrowserRouterProps> = ({ children, basename }) => {
  const resolvedBasename = useMemo(
    () => normalizeBasename(basename ?? getDefaultBasename()),
    [basename]
  );

  const getLocation = useCallback(
    () => getCurrentLocation(resolvedBasename),
    [resolvedBasename]
  );

  const createHref = useCallback(
    (to: string) => createHrefWithBasename(to, resolvedBasename),
    [resolvedBasename]
  );

  const [location, setLocation] = useState<RouterLocation>(() => getLocation());

  useEffect(() => {
    setLocation(getLocation());
  }, [getLocation]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setLocation(getLocation());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getLocation]);

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (typeof window === 'undefined') {
        return;
      }

      const href = createHref(to);

      if (options?.replace) {
        window.history.replaceState(null, '', href);
      } else {
        window.history.pushState(null, '', href);
      }

      setLocation(getLocation());
    },
    [createHref, getLocation]
  );

  const contextValue = useMemo(
    () => ({ location, navigate, createHref }),
    [location, navigate, createHref]
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
    const { location, navigate, createHref } = useRouterContext();
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
        href={createHref(to)}
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
    const { navigate, createHref } = useRouterContext();

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
        href={createHref(to)}
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
