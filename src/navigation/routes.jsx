import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { PlayPage } from '@/pages/IndexPage/PlayPage';

/**
 * @typedef {object} Route
 * @property {string} path
 * @property {import('react').ComponentType} Component
 * @property {string} [title]
 * @property {import('react').JSX.Element} [icon]
 */

/**
 * @type {Route[]}
 */
export const routes = [
  { path: '/', Component: IndexPage },
  { path: '/playgame', Component: PlayPage},
];
