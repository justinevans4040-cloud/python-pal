/* Python runs in a disposable Web Worker so runaway learner code cannot freeze the app. */
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";

const blocked = [
  /\bimport\s+js\b/,
  /\bfrom\s+js\s+import\b/,
  /\bimport\s+pyodide\b/,
  /\bfrom\s+pyodide\b/,
  /\bmicropip\b/,
  /\bpyfetch\b/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
];

self.onmessage = async (event) => {
  if (event.data?.type !== "run") return;
  const code = String(event.data.code || "");
  if (!code || code.length > 12000) {
    self.postMessage({ type: "error", error: "Code must contain between 1 and 12,000 characters." });
    return;
  }
  if (blocked.some(rule => rule.test(code))) {
    self.postMessage({
      type: "error",
      error: "This learning sandbox blocks browser, network, and package-install access."
    });
    return;
  }
  try {
    self.postMessage({ type: "loading" });
    importScripts(`${PYODIDE_BASE}pyodide.js`);
    const pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
    const pythonVersion = String(pyodide.runPython(
      "import platform; platform.python_version()"
    ));
    self.postMessage({ type: "ready", pythonVersion });
    pyodide.runPython(`
import io
import sys
_python_pal_stdout = io.StringIO()
_python_pal_stderr = io.StringIO()
sys.stdout = _python_pal_stdout
sys.stderr = _python_pal_stderr
`);
    let error = "";
    try {
      await pyodide.runPythonAsync(code);
    } catch (err) {
      error = String(err);
    }
    const stdout = String(pyodide.runPython("_python_pal_stdout.getvalue()"));
    const stderr = String(pyodide.runPython("_python_pal_stderr.getvalue()"));
    self.postMessage({ type: "result", stdout, error: error || stderr });
  } catch (err) {
    self.postMessage({ type: "error", error: `ENGINE_UNAVAILABLE: ${String(err)}` });
  }
};
