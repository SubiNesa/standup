import React from 'react';
import { render } from '@testing-library/react';

import StandupHome from './home';

describe('StandupHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StandupHome />);
    expect(baseElement).toBeTruthy();
  });
});
