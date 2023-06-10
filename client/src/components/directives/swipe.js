export default {
  mounted: function ($el, binding) {
    let startPos = 0;
    let endPos = 0;
    const minSwipeLength = 40;

    const getEventPos = (event) => {
      if (event.touches && event.touches.length > 0) {
        return event.touches[0].pageY;
      } else if (event.changedTouches && event.changedTouches.length > 0) {
        return event.changedTouches[0].pageY;
      } else {
        return event.pageY;
      }
    };

    const handleStart = (event) => {
      startPos = getEventPos(event);
    };

    const handleEnd = (event) => {
      endPos = getEventPos(event);
      const swipeLength = endPos - startPos;

      if (Math.abs(swipeLength) >= minSwipeLength) {
        binding.value(swipeLength < 0 ? 1 : -1);
      }
    };

    $el.addEventListener("touchstart", handleStart);
    $el.addEventListener("mousedown", handleStart);

    $el.addEventListener("touchend", handleEnd);
    $el.addEventListener("mouseup", handleEnd);
  },
};
