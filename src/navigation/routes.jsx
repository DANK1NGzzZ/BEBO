import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { PlayPage } from '@/pages/PlayPage/PlayPage';

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
  { path: '/', Component: PlayPage },
  { path: '/playgame', Component: PlayPage},
];
