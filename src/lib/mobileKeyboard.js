const TEXT_INPUT_TYPES = new Set(['text', 'email', 'tel', 'url', 'search', 'password', 'number']);

function acceptsKeyboard(element) {
  if (!element || element.disabled || element.readOnly || element.inputMode === 'none') return false;
  return element.isContentEditable || element.tagName === 'TEXTAREA'
    || (element.tagName === 'INPUT' && TEXT_INPUT_TYPES.has(element.type));
}

// Shared by both pages. Keep the controls mounted so their entrance animations
// do not restart, and avoid React renders during the keyboard's resize animation.
export function watchMobileKeyboard(win = window, doc = document) {
  const mobile = win.matchMedia('(any-pointer: coarse), (max-width: 760px)');
  const viewport = win.visualViewport;
  const height = () => viewport ? viewport.height * viewport.scale : win.innerHeight;
  let baseline = height();
  let width = win.innerWidth;
  let keyboardObserved = false;
  let dismissed = false;
  let blurTimer;
  const setHidden = value => doc.documentElement.classList.toggle('mobile-keyboard-open', value);
  const contracted = () => baseline - height() > Math.max(120, baseline * 0.18);

  function update() {
    if (!mobile.matches) {
      baseline = height();
      keyboardObserved = dismissed = false;
      setHidden(false);
      return;
    }
    if (Math.abs(win.innerWidth - width) > 80) {
      // A rotation changes the reference height, unlike a keyboard opening.
      width = win.innerWidth;
      baseline = height();
      keyboardObserved = dismissed = false;
    }
    baseline = Math.max(baseline, height());
    const editing = acceptsKeyboard(doc.activeElement);
    const shrunk = contracted();
    if (editing && shrunk) keyboardObserved = true;
    if (keyboardObserved && !shrunk) {
      // Android can dismiss the keyboard while retaining input focus.
      keyboardObserved = false;
      dismissed = true;
    }
    setHidden((editing && !dismissed) || (keyboardObserved && shrunk));
    if (!editing && !shrunk) baseline = height();
  }

  function onFocus(event) {
    win.clearTimeout(blurTimer);
    if (acceptsKeyboard(event.target)) dismissed = false;
    update();
  }
  function onPointer(event) {
    if (acceptsKeyboard(event.target) && event.target === doc.activeElement) {
      dismissed = false;
      update();
    }
  }
  function onBlur() {
    // Moving between fields must not briefly reveal the floating controls.
    blurTimer = win.setTimeout(update, 0);
  }

  doc.addEventListener('focusin', onFocus);
  doc.addEventListener('focusout', onBlur);
  doc.addEventListener('pointerdown', onPointer);
  win.addEventListener('resize', update);
  viewport?.addEventListener('resize', update);
  mobile.addEventListener('change', update);
  update();
  return () => {
    win.clearTimeout(blurTimer);
    doc.removeEventListener('focusin', onFocus);
    doc.removeEventListener('focusout', onBlur);
    doc.removeEventListener('pointerdown', onPointer);
    win.removeEventListener('resize', update);
    viewport?.removeEventListener('resize', update);
    mobile.removeEventListener('change', update);
    setHidden(false);
  };
}
