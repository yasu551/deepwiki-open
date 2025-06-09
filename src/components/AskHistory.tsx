'use client';
import React, { useState, useEffect } from 'react';
import { FaHistory, FaTimes } from 'react-icons/fa';
import Markdown from './Markdown';
import RepoInfo from '@/types/repoinfo';

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: number;
}

interface AskHistoryProps {
  repoInfo: RepoInfo;
}

const AskHistory: React.FC<AskHistoryProps> = ({ repoInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/ask-history?owner=${repoInfo.owner}&repo=${repoInfo.repo}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load ask history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [repoInfo.owner, repoInfo.repo]);

  const toggle = () => {
    if (!isOpen) {
      fetchHistory();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-6 right-24 w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--accent-primary)]/90 transition-all z-50"
        aria-label="Ask History"
      >
        <FaHistory />
      </button>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--card-bg)] text-[var(--foreground)] shadow-lg transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <h3 className="text-base font-semibold">Ask History</h3>
          <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <FaTimes />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full">
          {history.length === 0 ? (
            <div className="text-sm text-center text-[var(--muted)] mt-4">No history</div>
          ) : (
            <ul className="space-y-4 text-sm">
              {history.map((item, idx) => (
                <li key={idx} className="border-b border-[var(--border-color)] pb-2">
                  <p className="font-medium">{item.question}</p>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="mt-1">
                    <Markdown content={item.answer} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AskHistory;
