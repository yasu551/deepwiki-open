import { NextResponse } from 'next/server';

interface AskHistoryProject {
  owner: string;
  repo: string;
  name: string;
  submittedAt: number;
}

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_HOST || 'http://localhost:8001';
const ENDPOINT = `${PYTHON_BACKEND_URL}/api/ask_history_projects`;

export async function GET() {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorBody = { error: `Failed to fetch from Python backend: ${response.statusText}` };
      try {
        errorBody = await response.json();
      } catch {}
      console.error(`Error from Python backend (${ENDPOINT}): ${response.status} - ${JSON.stringify(errorBody)}`);
      return NextResponse.json(errorBody, { status: response.status });
    }

    const projects: AskHistoryProject[] = await response.json();
    return NextResponse.json(projects);
  } catch (error: unknown) {
    console.error(`Network or other error when fetching from ${ENDPOINT}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Failed to connect to the Python backend. ${message}` },
      { status: 503 }
    );
  }
}
