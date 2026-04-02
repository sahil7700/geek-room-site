import { NextResponse } from 'next/server';

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  const dbUrlLength = process.env.DATABASE_URL?.length || 0;
  const directUrlLength = process.env.DIRECT_URL?.length || 0;
  
  return NextResponse.json({
    message: "Environment Variable Diagnostics",
    envVariablesPresent: {
      DATABASE_URL: hasDatabaseUrl,
      DIRECT_URL: hasDirectUrl,
      DATABASE_URL_LENGTH: dbUrlLength,
      DIRECT_URL_LENGTH: directUrlLength,
    },
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('URL') || key.includes('POSTGRES')),
    nodeEnv: process.env.NODE_ENV
  });
}
