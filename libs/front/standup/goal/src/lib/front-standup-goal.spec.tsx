import React from 'react';
import { render } from '@testing-library/react';

import FrontStandupGoal from './front-standup-goal';

describe('FrontStandupGoal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontStandupGoal />);
    expect(baseElement).toBeTruthy();
  });
});
