import React from 'react';

if (import.meta.env.DEV) {
  import('@welldone-software/why-did-you-render').then((module) => {
    const whyDidYouRender = module.default;

    whyDidYouRender(React, {
      trackAllPureComponents: false,
      trackHooks: false,
      logOnDifferentValues: true,
      collapseGroups: true,
      titleColor: 'green',
      diffNameColor: 'darkturquoise',
      diffPathColor: 'darkturquoise',
      notifier: console.log,
      include: [
        /LoginForm/,
        /ThreadCard/,
        /VoteButtons/,
        /ThreadList/,
        /NavigationBar/,
      ],
      exclude: [
        /Spinner/,
        /LoadingSpinner/,
        /Skeleton/,
      ],
    });
  }).catch((error) => {
    console.warn('Failed to load Why Did You Render:', error);
  });
}

export {};
