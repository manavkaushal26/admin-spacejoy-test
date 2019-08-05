import React from "react";

function Layout({ children }) {
  return (
    <div className="app-layout" style={{ background: "pink" }}>
      {children}
    </div>
  );
}

export default Layout;
