import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { IssueFormModal } from "../issues/IssueFormModal";

// main layout that wrap all 
export function AppLayout() {
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-void grid-bg">
      <Sidebar onNewIssue={() => setIsNewIssueOpen(true)} />
      <main className="flex-1 overflow-hidden">
        <Outlet context={{ openNewIssue: () => setIsNewIssueOpen(true) }} />
      </main>
      <IssueFormModal
        isOpen={isNewIssueOpen}
        onClose={() => setIsNewIssueOpen(false)}
      />
    </div>
  );
}
