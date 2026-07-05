/**
 * Home Page — / (Investment Workspace)
 *
 * This is the primary and only application page (PROJECT_BLUEPRINT.md Section 7).
 * The workspace opens immediately without authentication.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Workspace } from "@/components/layout/Workspace";

export default function HomePage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <Workspace />
    </div>
  );
}
