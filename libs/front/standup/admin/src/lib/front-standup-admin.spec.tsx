import React from 'react';
import { render } from '@testing-library/react';

import FrontStandupAdmin from './front-standup-admin';

describe('FrontStandupAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontStandupAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
