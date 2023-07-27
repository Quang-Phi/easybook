import { useEffect, useState } from 'react';

const useScrollElementFixed = (div1Ref, div2Ref) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    let prevScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const topDiv1 = div1Ref?.current?.offsetTop || 0;
      const bottomDiv1 =
        div1Ref?.current?.offsetTop + div1Ref?.current?.clientHeight || 0;
      const topdiv2 = div2Ref?.current?.getBoundingClientRect().top || 0;

      if (prevScrollY < scrollY) {
        if (scrollY > topDiv1 && !isFixed) {
          setIsFixed(true);
        }
      } else if (bottomDiv1 < topdiv2 + div1Ref?.current?.clientHeight) {
        setIsFixed(false);
      }
      prevScrollY = scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  return [isFixed];
};

export default useScrollElementFixed;
