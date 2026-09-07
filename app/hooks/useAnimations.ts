import { useCallback } from "react";

interface UseAnimationsResult {
  animateListItems: (selector: string) => void;
  animateDetailTransition: (callback: () => void) => void;
}

export const useAnimations = (): UseAnimationsResult => {
  const animateListItems = useCallback((selector: string) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      setTimeout(() => {
        (item as HTMLElement).style.transform = "scale(0.95)";
        setTimeout(() => {
          (item as HTMLElement).style.transform = "scale(1)";
        }, 150);
      }, index * 20);
    });
  }, []);

  const animateDetailTransition = useCallback(
    (callback: () => void) => {
      const detailCard = document.querySelector(".detail-card");
      if (detailCard) {
        detailCard.classList.add("animate-fadeOut");
        setTimeout(() => {
          callback();
          detailCard.classList.remove("animate-fadeOut");
          detailCard.classList.add("animate-fadeIn");
          setTimeout(() => {
            detailCard.classList.remove("animate-fadeIn");
          }, 300);
        }, 150);
      } else {
        callback();
      }
    },
    []
  );

  return { animateListItems, animateDetailTransition };
};