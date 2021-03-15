import React from 'react';
import { render } from '@testing-library/react';

import FrontStandupHome from './front-standup-home';

describe('FrontStandupHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontStandupHome />);
    expect(baseElement).toBeTruthy();
  });
});
