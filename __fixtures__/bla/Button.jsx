// @flow

import React from 'react';
import { Theme } from '@atlaskit/theme';
import Button from '@atlaskit/button';

const DisplayThemeColors = () => (
  <Theme>
    {theme =>
      Object.keys(theme).map(k => (
        <div
          key={k}
          style={{
            backgroundColor: theme[k],
            color: color(theme[k]).negate(),
            display: 'inline-block',
            marginBottom: 10,
            marginRight: 10,
            padding: 10,
          }}
        >
          {k}
        </div>
      ))
    }
  </Theme>
);

const MyBtn = () => (
  <div>
    <div>
      <Theme>
        {theme => (
          <div style={{ ...theme, color: theme.textColor }}>inneeer</div>
        )}
      </Theme>
    </div>
  </div>
);

export default () => (
  <Theme
    values={() => ({
      backgroundColor: 'black',
      textColor: 'white',
      width: '20%',
    })}
  >
    {/* <MyBtn /> */}
    <Button appearance="primary">btn</Button>
  </Theme>
);
