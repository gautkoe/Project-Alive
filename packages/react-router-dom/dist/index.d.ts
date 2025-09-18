import * as React from 'react';

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

export interface BrowserRouterProps {
  children?: React.ReactNode;
}

export function BrowserRouter(props: BrowserRouterProps): React.ReactElement;

export interface RouteProps {
  path?: string;
  element?: React.ReactElement | null;
  index?: boolean;
}

export function Routes(props: { children?: React.ReactNode }): React.ReactElement | null;
export function Route(props: RouteProps): null;

export type NavigateFunction = (to: string, options?: NavigateOptions) => void;
export function useNavigate(): NavigateFunction;

export interface Location {
  pathname: string;
}

export function useLocation(): Location;

export interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  className?: string | ((params: { isActive: boolean }) => string);
  children?: React.ReactNode | ((params: { isActive: boolean }) => React.ReactNode);
  replace?: boolean;
}

export function NavLink(props: NavLinkProps): React.ReactElement;

export type LinkProps = NavLinkProps;

export function Link(props: LinkProps): React.ReactElement;

export default {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
  Link
};
