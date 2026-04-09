/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WallCalendar } from './components/WallCalendar';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] p-4 sm:p-8 flex items-center justify-center font-sans selection:bg-[#D4AF37] selection:text-black">
      <WallCalendar />
    </div>
  );
}


