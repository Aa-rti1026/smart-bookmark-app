"use client";

import React from "react";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
}

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onDelete }: Props) {
  if (bookmarks.length === 0) {
    return <p className="text-gray-500">No bookmarks yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center p-4 border rounded shadow-sm hover:bg-gray-50"
        >
          <div>
            <h3 className="font-semibold text-lg">{b.title}</h3>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm break-all"
            >
              {b.url}
            </a>
          </div>
          <button
            onClick={() => onDelete(b.id)}
            className="text-red-400 hover:text-red-600 px-3"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}