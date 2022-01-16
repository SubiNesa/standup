import React from 'react';
import { render } from '@testing-library/react';

import StandupProfile from './profile';

describe('StandupProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StandupProfile />);
    expect(baseElement).toBeTruthy();
  });
});
