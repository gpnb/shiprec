import React, { useState } from "react";
import '../styles/tab.css'
import { useLocation, useNavigate } from "react-router-dom";

const TabContainer = ({ currentTab, username, tabs = [], children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Always ensure tabs is an array
    const tabList = Array.isArray(tabs) ? tabs : [];

    // Extract the last part of the current URL
    const currentPath = location.pathname.split("/").pop();

    // Get initial active tab index
    const activeIndex = tabList.findIndex(
      (tab) =>
        tab.href === currentPath ||
        (tab.href === "" && (currentPath === currentTab || currentPath === ""))
    );

    const [activeTab, setActiveTab] = useState(activeIndex === -1 ? 0 : activeIndex);

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


