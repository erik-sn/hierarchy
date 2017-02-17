import * as React from 'react';
import { TransitionMotion, spring } from 'react-motion';

const willEnter = () => {
  console.log('entering');
  return {
    opacity: 0,
    scale: 0.98,
  };
}

const willLeave = () => {
  console.log('leaving');
  return {
    opacity: spring(0),
    scale: spring(1.02),
  };
}

const getStyles = () => ({
  opacity: spring(1),
  scale: spring(1),
});

const Transition = ({ children: child, key }: any) => (
  <TransitionMotion
    styles={ [{
      key,
      style: getStyles(),
      data: {child},
    }] }
    willEnter={willEnter}
    willLeave={willLeave}
  >
    { (interpolated: any) => {
      console.log(interpolated);
      return (
        <div>
          { interpolated.map(({ key, style, data }: any) =>
            <div
              key={`${key}-transition`}
              style={ {
                ...styles.wrapper,
                opacity: style.opacity,
                transform: `scale(${style.scale})`,
              } }
            >
              {data.child}
            </div>,
          )}
        </div>
      );
    }
    }
  </TransitionMotion>
);

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
  },
};

export default Transition;
