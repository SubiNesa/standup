import React from 'react';
import { render } from '@testing-library/react';

import FrontStandupProfile from './front-standup-profile';

describe('FrontStandupProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontStandupProfile />);
    expect(baseElement).toBeTruthy();
  });
});
