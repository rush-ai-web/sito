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
  let baseline = 0;
  let width = 0;
  let keyboardObserved = false;
  let dismissed = false;
  let blurTimer;
  let hidden = false;
  const setHidden = value => {
    if (value === hidden) return;
    hidden = value;
    doc.documentElement.classList.toggle('mobile-keyboard-open', value);
  };

  function update() {
    if (!mobile.matches) {
      baseline = width = 0;
      keyboardObserved = dismissed = false;
      setHidden(false);
      return;
    }
    // Read once, before the class write. visualViewport/innerWidth can flush
    // layout; re-reading after toggling the root class forced a second pass.
    const currentHeight = height();
    const currentWidth = win.innerWidth;
    if (Math.abs(currentWidth - width) > 80) {
      // A rotation changes the reference height, unlike a keyboard opening.
      width = currentWidth;
      baseline = currentHeight;
      keyboardObserved = dismissed = false;
    }
    baseline = Math.max(baseline, currentHeight);
    const editing = acceptsKeyboard(doc.activeElement);
    const shrunk = baseline - currentHeight > Math.max(120, baseline * 0.18);
    if (editing && shrunk) keyboardObserved = true;
    if (keyboardObserved && !shrunk) {
      // Android can dismiss the keyboard while retaining input focus.
      keyboardObserved = false;
      dismissed = true;
    }
    setHidden((editing && !dismissed) || (keyboardObserved && shrunk));
    if (!editing && !shrunk) baseline = currentHeight;
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
