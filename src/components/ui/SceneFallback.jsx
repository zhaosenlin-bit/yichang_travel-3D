import { Component } from 'react';

/**
 * WebGL support pre-check — used to avoid mounting the 3D Canvas
 * (and crashing the app) when WebGL is unavailable or disabled.
 */
export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'))
    );
  } catch (err) {
    return false;
  }
}

const fallbackStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  background: '#faf7f0',
  color: '#3a3428',
  fontFamily: 'system-ui, sans-serif',
  textAlign: 'center',
  padding: 24,
};

export function WebGLFallback() {
  return (
    <FallbackScreen
      title="浏览器不支持 WebGL"
      detail="当前浏览器无法创建 WebGL 3D 环境，请开启浏览器硬件加速，或更换新版 Chrome / Edge 浏览器后再试。"
    />
  );
}

export function FallbackScreen({ title, detail }) {
  return (
    <div style={fallbackStyle}>
      <div style={{ fontSize: 48 }}>🏞️</div>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: 480, fontSize: 14, lineHeight: 1.7, color: '#6b6455' }}>{detail}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 8,
          padding: '10px 28px',
          border: '1px solid #c9a86a',
          borderRadius: 100,
          background: 'transparent',
          color: '#7a5c2e',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        重新加载
      </button>
    </div>
  );
}

/**
 * Catches any runtime error inside the 3D app so the user sees a readable
 * message instead of a blank white screen.
 */
export class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SceneErrorBoundary] 3D scene crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackScreen
          title="3D 场景加载失败"
                  detail={'页面运行出错了，请刷新重试。如果仍然失败，请开启浏览器的硬件加速，或更换新版 Chrome / Edge 浏览器。\n\n' + String(this.state.error)}
        />
      );
    }
    return this.props.children;
  }
}
