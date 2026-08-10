let engineWorker;

function getEngineWorker() {
  if (engineWorker) return engineWorker;

  const engineUrl = new URL('python-engine-worker.mjs', self.location.href);
  engineWorker = new Worker(engineUrl, { type: 'module' });
  engineWorker.onmessage = event => self.postMessage(event.data);
  engineWorker.onerror = () => {
    self.postMessage({ type: 'error', error: 'ENGINE_UNAVAILABLE' });
  };
  return engineWorker;
}

self.onmessage = event => {
  if (event.data?.type !== 'run') return;
  getEngineWorker().postMessage(event.data);
};
