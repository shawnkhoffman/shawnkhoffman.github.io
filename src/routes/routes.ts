import { ComponentType } from 'react';
import AboutThisSite from '../pages/AboutThisSite/AboutThisSite';
import { Index, NotFound, About } from './lazyRoutes';

export interface RouteConfig {
  path: string;
  element: ComponentType;
}

const routes: RouteConfig[] = [
  { path: '/', element: Index },
  { path: '/about-me', element: About },
  { path: '/about-this-site', element: AboutThisSite },
  { path: '*', element: NotFound },
];

export default routes;