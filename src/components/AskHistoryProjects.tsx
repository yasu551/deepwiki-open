'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface AskHistoryProject {
  owner: string;
  repo: string;
  name: string;
  submittedAt: number;
}

export default function AskHistoryProjects() {
  const [projects, setProjects] = useState<AskHistoryProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ask-history/projects');
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setProjects(data as AskHistoryProject[]);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(message);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <p className="text-[var(--muted)]">Loading...</p>;
  }

  if (error) {
    return <p className="text-[var(--highlight)]">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ask History Projects</h1>
      {projects.length === 0 ? (
        <p className="text-[var(--muted)]">No ask history found.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={`${p.owner}/${p.repo}`} className="border border-[var(--border-color)] rounded p-3 bg-[var(--card-bg)]">
              <Link href={`/${p.owner}/${p.repo}`}>{p.name}</Link>
              <div className="text-xs text-[var(--muted)]">
                {new Date(p.submittedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
