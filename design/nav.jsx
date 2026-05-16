// Navigation router for interactive prototype
// Safe no-op when not inside a NavProvider (so design canvas keeps working)

const NavContext = React.createContext(null);

function useNav() {
  const ctx = React.useContext(NavContext);
  return ctx || {
    go: () => {}, back: () => {}, replace: () => {},
    current: null, stack: [], canBack: false,
  };
}

function NavProvider({ initial = 'home', children, onChange }) {
  const [stack, setStack] = React.useState([initial]);
  const current = stack[stack.length - 1];

  const go = React.useCallback((id) => {
    if (!id) return;
    setStack((s) => [...s, id]);
  }, []);
  const replace = React.useCallback((id) => {
    if (!id) return;
    setStack((s) => [...s.slice(0, -1), id]);
  }, []);
  const back = React.useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const reset = React.useCallback((id) => {
    setStack([id]);
  }, []);

  React.useEffect(() => { onChange && onChange(current); }, [current]);

  const value = React.useMemo(() => ({
    go, back, replace, reset,
    current, stack, canBack: stack.length > 1,
  }), [stack, go, back, replace, reset]);

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

// Tappable wrapper — used in screens to mark clickable regions
function Tap({ to, replace = false, onClick, children, style }) {
  const nav = useNav();
  const handle = (e) => {
    if (onClick) onClick(e);
    if (to) {
      if (replace) nav.replace(to);
      else nav.go(to);
    }
  };
  return (
    <div onClick={handle} style={{ cursor: 'pointer', ...style }}>
      {children}
    </div>
  );
}

Object.assign(window, { NavContext, NavProvider, useNav, Tap });
