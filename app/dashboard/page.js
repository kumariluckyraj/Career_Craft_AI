"use client";

import { useEffect, useState } from "react";

export default function Dashboard({ userId }) {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/pitch/reminder?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setShowReminder(data.showReminder))
      .catch(() => setShowReminder(true));
  }, [userId]);

  return (
    <div>
      {showReminder && (
        <div className="mb-4 rounded-md bg-yellow-100 p-3 text-yellow-800">
          ⚠️ You haven’t generated a pitch this week.
          <br />
          Don’t break your streak!
        </div>
      )}

      {/* rest of dashboard */}
    </div>
  );
}
