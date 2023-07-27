import { useEffect, useState } from 'react';

const useScrollWaiting = (
  div1Ref,
  parrentdiv1,
  headerHeight = 110,
  space = 0,
  diff = 0,
) => {
  const [isFixed, setIsFixed] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [div1Width, setDiv1Width] = useState(0);

  useEffect(() => {
    let prevScrollY = 0;

    const handleScroll = () => {
      const topDiv1 = div1Ref?.current?.getBoundingClientRect().top || 0;
      const bottomDiv1 = div1Ref?.current?.getBoundingClientRect().bottom || 0;
      const bottomParentDiv1 =
        parrentdiv1?.current?.getBoundingClientRect().bottom || 0;
      const topParentDiv1 =
        parrentdiv1?.current?.getBoundingClientRect().top || 0;

      const currentScrollY = window.scrollY;
      setDiv1Width(
        parrentdiv1
          ? parrentdiv1?.current?.getBoundingClientRect().width - 15
          : 0,
      );
      if (currentScrollY > prevScrollY) {
        if (bottomDiv1 - diff > bottomParentDiv1) {
          setIsFixed(false);
          setIsAbsolute(true);
        } else if (
          topParentDiv1 < headerHeight + space - diff &&
          !isFixed &&
          !isAbsolute
        ) {
          setIsFixed(true);
        }
      } else if (currentScrollY < prevScrollY) {
        if (topParentDiv1 > headerHeight + space - diff) {
          setIsFixed(false);
        } else if (topDiv1 > space + headerHeight) {
          setIsFixed(true);
          setIsAbsolute(false);
        }
      }
      prevScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return [isFixed, isAbsolute, div1Width];
};

export default useScrollWaiting;
