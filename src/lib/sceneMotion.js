// Coordinate sibling decorations with native entrances, without a scroll
// listener, layout reads, or React updates on every frame. Pending offscreen
// cards must not hold a tall scene paused until the user reaches its bottom.
export function watchSceneEntrances(node, onIdle = () => {}) {
  let previous;
  const sync = () => {
    const entering = Boolean(node.querySelector('[data-entry-running]'));
    if (entering === previous) return;
    previous = entering;
    if (entering) node.dataset.sceneEntering = '';
    else delete node.dataset.sceneEntering;
    onIdle(!entering);
  };
  const observer = new MutationObserver(sync);
  observer.observe(node, {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-entry-running'],
  });
  sync();
  return () => {
    observer.disconnect();
    delete node.dataset.sceneEntering;
  };
}
