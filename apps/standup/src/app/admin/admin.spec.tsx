import React from 'react';
import { render } from '@testing-library/react';

import StandupAdmin from './admin';

describe('StandupAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StandupAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
