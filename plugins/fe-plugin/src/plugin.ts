import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const fePluginPlugin = createPlugin({
  id: 'fe-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const FePluginPage = fePluginPlugin.provide(
  createRoutableExtension({
    name: 'FePluginPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
