import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { fePluginPlugin, FePluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(fePluginPlugin)
  .addPage({
    element: <FePluginPage />,
    title: 'Root Page',
    path: '/fe-plugin',
  })
  .render();
