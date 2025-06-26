import React, { useState } from "react";
import '../styles/tab.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TabContainer = ({ currentTab, username, tabs = [], children }) => {
    
  const navigate = useNavigate();
    const location = useLocation();

    // Always ensure tabs is an array
    const tabList = Array.isArray(tabs) ? tabs : [];

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
      const currentPath = location.pathname.split("/").pop();
    
      const newIndex = tabList.findIndex(
        (tab) =>
          tab.href.split("/").pop() === currentPath ||
          (tab.href === "" && (currentPath === currentTab || currentPath === ""))
      );
    
      if (newIndex !== -1 && newIndex !== activeTab) {
        setActiveTab(newIndex);
      }
    }, [location.pathname, tabList]);

    const handleTabClick = (i, href) => {
      setActiveTab(i);
      if (href !== undefined && href !== null) {
        navigate(href, { relative: "path" });
      }
    };

    const tabWidth = tabList.length > 0 ? `${100 / tabList.length}%` : "100%";

    return (
      <>
        <div className="tabHeader">
          <div className="tabHeader-Text">{currentTab}</div>
          <div className="tabHeader-Name">{username || ""}</div>
        </div>

        <div className="MainTabs">
          {tabList.length === 0 ? (
            <div className="NoTab"></div>
          ) : (
            tabList.map((tab, i) => (
              <div
                key={i}
                className={`Tab-Choice ${i === activeTab ? "active" : ""}`}
                style={{ width: tabWidth }}
                onClick={() => handleTabClick(i, tab.href)}
              >
                <div className="Tab-Label">{tab.label}</div>
              </div>
            ))
          )}
        </div>

        <div className="TabContentArea">{children}</div>
      </>
    );
};

export default TabContainer;


