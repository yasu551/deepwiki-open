import { NextRequest, NextResponse } from 'next/server';

// Forward requests to the Python backend to store ask history in the same place
// as generated wiki data
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_HOST || 'http://localhost:8001';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  if (!owner || !repo) {
    return NextResponse.json({ error: 'owner and repo required' }, { status: 400 });
  }
  const targetUrl = `${PYTHON_BACKEND_URL}/api/ask_history?owner=${owner}&repo=${repo}`;
  const res = await fetch(targetUrl, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo, question, answer } = body || {};
    if (!owner || !repo || !question || !answer) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }
    const targetUrl = `${PYTHON_BACKEND_URL}/api/ask_history`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner, repo, question, answer, timestamp: Date.now() })
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Failed to save ask history', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
