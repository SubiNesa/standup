import React from 'react';
import { render } from '@testing-library/react';

import StandupGoal from './goal';

describe('StandupGoal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StandupGoal ticket={undefined} title={undefined} fnish={undefined} blocked={undefined} details={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
